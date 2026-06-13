MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
]

def get_month_name(index: int) -> str:
    """Get the name of a month from its index (0-11) with wrapping."""
    normalized_index = ((index % 12) + 12) % 12
    return MONTHS[normalized_index]

def get_base_month_index(season: str) -> int:
    """Get the base planting month index for a farming season."""
    clean = season.lower().strip()
    if clean == 'kharif':
        return 5  # June
    if clean == 'rabi':
        return 10  # November
    if clean == 'zaid':
        return 2  # March
    return 5  # Default to June

def get_planting_month(base_month_index: int, zone_index: int) -> str:
    """Calculate the staggered planting month name for a zone."""
    planting_index = (base_month_index + zone_index) % 12
    return get_month_name(planting_index)

def get_harvest_month(base_month_index: int, zone_index: int, duration_days: int) -> str:
    """Calculate the harvest month name based on planting month and crop duration."""
    planting_index = (base_month_index + zone_index) % 12
    duration_months = int(math_floor(duration_days / 30))
    harvest_index = (planting_index + duration_months) % 12
    return get_month_name(harvest_index)

def math_floor(val):
    import math
    return math.floor(val)
