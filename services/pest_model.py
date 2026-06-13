import logging
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from data.pest_rules import PEST_RULES

logger = logging.getLogger(__name__)

class PestClassifier:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(token_pattern=r'(?u)\b\w+\b')
        self.rules = PEST_RULES
        self._initialize_model()

    def set_rules(self, rules_list):
        """Allow updating rules dynamically (e.g. after database fetch)."""
        if rules_list and len(rules_list) > 0:
            self.rules = rules_list
            self._initialize_model()

    def _initialize_model(self):
        """Train TF-IDF vectorizer on the symptoms vocabulary of all rules."""
        logger.info("Initializing NLP symptom similarity model...")
        documents = []
        for r in self.rules:
            # Join symptom keywords to form a document describing the pest symptoms
            symptoms_doc = " ".join(r['symptom_keywords'])
            documents.append(symptoms_doc)
            
        # Fit vectorizer
        if documents:
            self.vectorizer.fit(documents)
            self.rule_vectors = self.vectorizer.transform(documents)
        logger.info("NLP similarity model ready.")

    def classify_symptoms(self, crop_name, symptoms):
        """Classify a list of symptoms to find the matching pest rule using TF-IDF cosine similarity."""
        if not symptoms or not isinstance(symptoms, list) or len(symptoms) == 0:
            return self._make_default_response(crop_name, symptoms)

        clean_crop = crop_name.lower().strip() if crop_name else 'general'
        
        # 1. Filter indices matching the crop
        matching_indices = []
        for idx, rule in enumerate(self.rules):
            r_crop = rule['crop_name'].lower()
            r_keywords = [k.lower() for k in rule.get('crop_keywords', [])]
            
            if r_crop == clean_crop or r_crop == 'general' or clean_crop in r_keywords:
                matching_indices.append(idx)
                
        # If no specific rules match, fallback to general rules
        if not matching_indices:
            matching_indices = [
                idx for idx, r in enumerate(self.rules) 
                if r['crop_name'].lower() == 'general'
            ]
            
        if not matching_indices:
            return self._make_default_response(crop_name, symptoms)

        # 2. Build user symptoms query vector
        query_text = " ".join(symptoms)
        query_vector = self.vectorizer.transform([query_text])
        
        # 3. Compute cosine similarity for filtered rules
        best_idx = -1
        best_similarity = 0.0
        
        for idx in matching_indices:
            rule_vector = self.rule_vectors[idx]
            sim = float(cosine_similarity(query_vector, rule_vector)[0][0])
            if sim > best_similarity:
                best_similarity = sim
                best_idx = idx
                
        # Convert similarity to 0-100 scale
        confidence = round(best_similarity * 100, 2)
        
        # If confidence is below 30% threshold, trigger default safety response
        if best_idx == -1 or confidence < 30.0:
            # Try fuzzy string matching fallback just in case TF-IDF missed a direct word match
            fuzzy_idx, fuzzy_conf = self._fuzzy_fallback(clean_crop, symptoms, matching_indices)
            if fuzzy_idx != -1 and fuzzy_conf >= 30.0:
                best_idx = fuzzy_idx
                confidence = fuzzy_conf
            else:
                return self._make_default_response(crop_name, symptoms)

        matched_rule = self.rules[best_idx]
        
        # Determine confidence label
        confidence_label = 'Possible Match'
        if confidence > 80:
            confidence_label = 'High Confidence Match'
        elif confidence > 60:
            confidence_label = 'Likely Match'

        return {
            'crop_name': crop_name,
            'symptoms_provided': symptoms,
            'pest_name': matched_rule['pest_name'],
            'pest_type': matched_rule.get('pest_type', 'unknown'),
            'severity': matched_rule.get('severity', 'medium'),
            'confidence': confidence,
            'confidence_label': confidence_label,
            'description': matched_rule['description'],
            'traditional_remedy': matched_rule['traditional_remedy'],
            'chemical_option': matched_rule.get('chemical_option', 'None recommended.'),
            'prevention_tips': matched_rule.get('prevention_tips', 'Practice regular farm monitoring.'),
            'disclaimer': 'Disclaimer: This is an AI-assisted diagnostic match. We recommend obtaining an on-site confirmation from a qualified local agricultural extension officer before applying chemical treatments.'
        }

    def _fuzzy_fallback(self, clean_crop, symptoms, matching_indices):
        """Simple token inclusion fallback for short queries or exact matches."""
        best_idx = -1
        best_ratio = 0.0
        
        for idx in matching_indices:
            rule = self.rules[idx]
            matches = 0
            for kw in rule['symptom_keywords']:
                kw_clean = kw.lower().strip()
                if any(kw_clean in s.lower() or s.lower() in kw_clean for s in symptoms):
                    matches += 1
                    
            if len(rule['symptom_keywords']) > 0:
                ratio = matches / len(rule['symptom_keywords'])
                if ratio > best_ratio:
                    best_ratio = ratio
                    best_idx = idx
                    
        return best_idx, round(best_ratio * 100, 2)

    def _make_default_response(self, crop_name, symptoms):
        """Construct standard safety advice fallback."""
        return {
            'crop_name': crop_name,
            'symptoms_provided': symptoms,
            'pest_name': 'Undetermined Disease/Pest',
            'pest_type': 'unknown',
            'severity': 'low',
            'confidence': 0.0,
            'confidence_label': 'No Match Found',
            'description': 'The symptoms described do not closely match a specific pest in our database.',
            'traditional_remedy': 'We recommend consulting your local Krishi Vigyan Kendra (KVK) agricultural officer with a sample of the affected plant for accurate local diagnosis.',
            'chemical_option': 'Avoid applying general chemical sprays without positive identification, as it may kill beneficial insects and worsen infestations.',
            'prevention_tips': 'Keep the field clear of weed hosts and dispose of affected plant material immediately to prevent spread.',
            'disclaimer': 'Disclaimer: On-site inspection by an agronomist is recommended for confirmation.'
        }

# Global ML Classifier instance
pest_classifier = PestClassifier()
