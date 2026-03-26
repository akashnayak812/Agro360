"""
Location-based services for auto-fetching weather and regional soil data.
This helps uneducated farmers by automatically getting climate data.
"""
import requests
import os

# Regional soil data for major Indian states/districts
# Based on average soil characteristics from government soil health databases
REGIONAL_SOIL_DATA = {
    # Telangana
    ("Telangana", "Hyderabad"): {"N": 42, "P": 35, "K": 45, "ph": 7.2, "soil_type": "black_clay"},
    ("Telangana", "Warangal"): {"N": 45, "P": 38, "K": 48, "ph": 7.0, "soil_type": "black_clay"},
    ("Telangana", "Karimnagar"): {"N": 40, "P": 32, "K": 42, "ph": 7.5, "soil_type": "black_clay"},
    ("Telangana", "Nizamabad"): {"N": 48, "P": 40, "K": 50, "ph": 6.8, "soil_type": "black_clay"},
    ("Telangana", "Khammam"): {"N": 38, "P": 35, "K": 40, "ph": 6.5, "soil_type": "red_loamy"},
    ("Telangana", "Nalgonda"): {"N": 35, "P": 30, "K": 38, "ph": 7.8, "soil_type": "black_clay"},
    ("Telangana", "Medak"): {"N": 44, "P": 36, "K": 46, "ph": 7.1, "soil_type": "black_clay"},
    ("Telangana", "Rangareddy"): {"N": 40, "P": 34, "K": 44, "ph": 7.3, "soil_type": "red_sandy"},
    
    # Andhra Pradesh
    ("Andhra Pradesh", "Visakhapatnam"): {"N": 35, "P": 28, "K": 38, "ph": 6.2, "soil_type": "red_sandy"},
    ("Andhra Pradesh", "Vijayawada"): {"N": 50, "P": 42, "K": 52, "ph": 7.0, "soil_type": "alluvial"},
    ("Andhra Pradesh", "Guntur"): {"N": 48, "P": 40, "K": 50, "ph": 7.2, "soil_type": "black_clay"},
    ("Andhra Pradesh", "Tirupati"): {"N": 32, "P": 25, "K": 35, "ph": 6.0, "soil_type": "red_sandy"},
    ("Andhra Pradesh", "Kurnool"): {"N": 38, "P": 32, "K": 40, "ph": 7.5, "soil_type": "black_clay"},
    ("Andhra Pradesh", "Anantapur"): {"N": 30, "P": 25, "K": 32, "ph": 7.8, "soil_type": "red_sandy"},
    ("Andhra Pradesh", "Nellore"): {"N": 45, "P": 38, "K": 48, "ph": 6.8, "soil_type": "alluvial"},
    ("Andhra Pradesh", "Kadapa"): {"N": 35, "P": 30, "K": 38, "ph": 7.2, "soil_type": "red_sandy"},
    
    # Maharashtra
    ("Maharashtra", "Pune"): {"N": 50, "P": 40, "K": 50, "ph": 6.8, "soil_type": "black_clay"},
    ("Maharashtra", "Nagpur"): {"N": 55, "P": 45, "K": 55, "ph": 7.2, "soil_type": "black_clay"},
    ("Maharashtra", "Nashik"): {"N": 45, "P": 38, "K": 48, "ph": 6.5, "soil_type": "black_clay"},
    ("Maharashtra", "Aurangabad"): {"N": 48, "P": 40, "K": 50, "ph": 7.5, "soil_type": "black_clay"},
    ("Maharashtra", "Kolhapur"): {"N": 52, "P": 42, "K": 52, "ph": 6.2, "soil_type": "laterite"},
    ("Maharashtra", "Solapur"): {"N": 40, "P": 35, "K": 42, "ph": 8.0, "soil_type": "black_clay"},
    ("Maharashtra", "Amravati"): {"N": 50, "P": 42, "K": 52, "ph": 7.0, "soil_type": "black_clay"},
    ("Maharashtra", "Latur"): {"N": 45, "P": 38, "K": 48, "ph": 7.8, "soil_type": "black_clay"},
    
    # Karnataka
    ("Karnataka", "Bangalore"): {"N": 35, "P": 30, "K": 38, "ph": 6.0, "soil_type": "red_sandy"},
    ("Karnataka", "Mysore"): {"N": 40, "P": 35, "K": 42, "ph": 6.2, "soil_type": "red_loamy"},
    ("Karnataka", "Belgaum"): {"N": 48, "P": 40, "K": 50, "ph": 7.0, "soil_type": "black_clay"},
    ("Karnataka", "Hubli"): {"N": 45, "P": 38, "K": 48, "ph": 7.2, "soil_type": "black_clay"},
    ("Karnataka", "Mangalore"): {"N": 38, "P": 32, "K": 40, "ph": 5.5, "soil_type": "laterite"},
    ("Karnataka", "Gulbarga"): {"N": 42, "P": 35, "K": 45, "ph": 8.0, "soil_type": "black_clay"},
    ("Karnataka", "Davangere"): {"N": 40, "P": 34, "K": 42, "ph": 7.5, "soil_type": "black_clay"},
    ("Karnataka", "Shimoga"): {"N": 45, "P": 38, "K": 48, "ph": 5.8, "soil_type": "laterite"},
    
    # Tamil Nadu
    ("Tamil Nadu", "Chennai"): {"N": 30, "P": 25, "K": 32, "ph": 7.5, "soil_type": "alluvial"},
    ("Tamil Nadu", "Coimbatore"): {"N": 38, "P": 32, "K": 40, "ph": 7.0, "soil_type": "red_loamy"},
    ("Tamil Nadu", "Madurai"): {"N": 35, "P": 30, "K": 38, "ph": 7.8, "soil_type": "black_clay"},
    ("Tamil Nadu", "Trichy"): {"N": 40, "P": 35, "K": 42, "ph": 7.2, "soil_type": "alluvial"},
    ("Tamil Nadu", "Salem"): {"N": 32, "P": 28, "K": 35, "ph": 6.5, "soil_type": "red_sandy"},
    ("Tamil Nadu", "Tirunelveli"): {"N": 38, "P": 32, "K": 40, "ph": 7.5, "soil_type": "red_loamy"},
    ("Tamil Nadu", "Thanjavur"): {"N": 55, "P": 45, "K": 55, "ph": 6.8, "soil_type": "alluvial"},
    ("Tamil Nadu", "Erode"): {"N": 35, "P": 30, "K": 38, "ph": 7.0, "soil_type": "red_loamy"},
    
    # Punjab
    ("Punjab", "Ludhiana"): {"N": 55, "P": 45, "K": 55, "ph": 7.5, "soil_type": "alluvial"},
    ("Punjab", "Amritsar"): {"N": 52, "P": 42, "K": 52, "ph": 7.8, "soil_type": "alluvial"},
    ("Punjab", "Jalandhar"): {"N": 50, "P": 40, "K": 50, "ph": 7.2, "soil_type": "alluvial"},
    ("Punjab", "Patiala"): {"N": 48, "P": 40, "K": 50, "ph": 7.5, "soil_type": "alluvial"},
    
    # Haryana
    ("Haryana", "Gurgaon"): {"N": 42, "P": 35, "K": 45, "ph": 8.0, "soil_type": "alluvial"},
    ("Haryana", "Karnal"): {"N": 50, "P": 42, "K": 52, "ph": 7.5, "soil_type": "alluvial"},
    ("Haryana", "Hisar"): {"N": 38, "P": 32, "K": 40, "ph": 8.2, "soil_type": "alluvial"},
    
    # Uttar Pradesh
    ("Uttar Pradesh", "Lucknow"): {"N": 48, "P": 40, "K": 50, "ph": 7.5, "soil_type": "alluvial"},
    ("Uttar Pradesh", "Varanasi"): {"N": 52, "P": 42, "K": 52, "ph": 7.2, "soil_type": "alluvial"},
    ("Uttar Pradesh", "Agra"): {"N": 45, "P": 38, "K": 48, "ph": 8.0, "soil_type": "alluvial"},
    ("Uttar Pradesh", "Kanpur"): {"N": 50, "P": 40, "K": 50, "ph": 7.5, "soil_type": "alluvial"},
    ("Uttar Pradesh", "Meerut"): {"N": 48, "P": 40, "K": 50, "ph": 7.8, "soil_type": "alluvial"},
    
    # Madhya Pradesh
    ("Madhya Pradesh", "Bhopal"): {"N": 45, "P": 38, "K": 48, "ph": 7.5, "soil_type": "black_clay"},
    ("Madhya Pradesh", "Indore"): {"N": 50, "P": 42, "K": 52, "ph": 7.0, "soil_type": "black_clay"},
    ("Madhya Pradesh", "Jabalpur"): {"N": 48, "P": 40, "K": 50, "ph": 6.8, "soil_type": "alluvial"},
    ("Madhya Pradesh", "Gwalior"): {"N": 42, "P": 35, "K": 45, "ph": 8.0, "soil_type": "alluvial"},
    
    # Rajasthan
    ("Rajasthan", "Jaipur"): {"N": 30, "P": 25, "K": 32, "ph": 8.5, "soil_type": "desert"},
    ("Rajasthan", "Jodhpur"): {"N": 25, "P": 20, "K": 28, "ph": 8.8, "soil_type": "desert"},
    ("Rajasthan", "Udaipur"): {"N": 35, "P": 30, "K": 38, "ph": 7.5, "soil_type": "black_clay"},
    ("Rajasthan", "Kota"): {"N": 40, "P": 35, "K": 42, "ph": 7.8, "soil_type": "alluvial"},
    
    # Gujarat
    ("Gujarat", "Ahmedabad"): {"N": 38, "P": 32, "K": 40, "ph": 8.0, "soil_type": "alluvial"},
    ("Gujarat", "Surat"): {"N": 45, "P": 38, "K": 48, "ph": 7.5, "soil_type": "black_clay"},
    ("Gujarat", "Vadodara"): {"N": 48, "P": 40, "K": 50, "ph": 7.2, "soil_type": "black_clay"},
    ("Gujarat", "Rajkot"): {"N": 35, "P": 30, "K": 38, "ph": 8.2, "soil_type": "black_clay"},
    
    # West Bengal
    ("West Bengal", "Kolkata"): {"N": 45, "P": 38, "K": 48, "ph": 6.5, "soil_type": "alluvial"},
    ("West Bengal", "Howrah"): {"N": 48, "P": 40, "K": 50, "ph": 6.8, "soil_type": "alluvial"},
    ("West Bengal", "Darjeeling"): {"N": 35, "P": 30, "K": 38, "ph": 5.5, "soil_type": "mountain"},
    
    # Bihar
    ("Bihar", "Patna"): {"N": 50, "P": 42, "K": 52, "ph": 7.2, "soil_type": "alluvial"},
    ("Bihar", "Gaya"): {"N": 45, "P": 38, "K": 48, "ph": 7.5, "soil_type": "alluvial"},
    ("Bihar", "Muzaffarpur"): {"N": 52, "P": 45, "K": 55, "ph": 7.0, "soil_type": "alluvial"},
    
    # Odisha
    ("Odisha", "Bhubaneswar"): {"N": 38, "P": 32, "K": 40, "ph": 6.2, "soil_type": "laterite"},
    ("Odisha", "Cuttack"): {"N": 45, "P": 38, "K": 48, "ph": 6.5, "soil_type": "alluvial"},
    
    # Kerala
    ("Kerala", "Thiruvananthapuram"): {"N": 35, "P": 30, "K": 38, "ph": 5.5, "soil_type": "laterite"},
    ("Kerala", "Kochi"): {"N": 38, "P": 32, "K": 40, "ph": 5.8, "soil_type": "laterite"},
    ("Kerala", "Kozhikode"): {"N": 40, "P": 35, "K": 42, "ph": 5.5, "soil_type": "laterite"},
}

# Soil type descriptions and estimated NPK values
SOIL_TYPE_DATA = {
    "black_sticky": {
        "name": "Black Cotton Soil",
        "local_names": {"en": "Black Soil", "hi": "काली मिट्टी", "te": "నల్ల మట్టి"},
        "N": 45, "P": 35, "K": 40, "ph": 7.5,
        "description": "Dark colored, sticky when wet, cracks when dry",
        "crops": ["Cotton", "Wheat", "Jowar", "Sunflower"]
    },
    "red_sandy": {
        "name": "Red Sandy Soil",
        "local_names": {"en": "Red Soil", "hi": "लाल मिट्टी", "te": "ఎర్ర మట్టి"},
        "N": 30, "P": 25, "K": 35, "ph": 6.0,
        "description": "Reddish color, sandy texture, drains water quickly",
        "crops": ["Groundnut", "Millets", "Pulses", "Tobacco"]
    },
    "brown_loamy": {
        "name": "Loamy Soil",
        "local_names": {"en": "Brown Soil", "hi": "दोमट मिट्टी", "te": "గోధుమ మట్టి"},
        "N": 50, "P": 45, "K": 50, "ph": 6.5,
        "description": "Brown colored, soft texture, holds water well",
        "crops": ["Rice", "Vegetables", "Fruits", "Sugarcane"]
    },
    "yellow_clay": {
        "name": "Laterite Soil",
        "local_names": {"en": "Yellow/Laterite", "hi": "पीली मिट्टी", "te": "పసుపు మట్టి"},
        "N": 35, "P": 30, "K": 38, "ph": 5.5,
        "description": "Yellowish color, hard when dry, acidic nature",
        "crops": ["Tea", "Coffee", "Cashew", "Rubber"]
    },
    "alluvial": {
        "name": "Alluvial Soil",
        "local_names": {"en": "River Soil", "hi": "जलोढ़ मिट्टी", "te": "ఒండ్రు మట్టి"},
        "N": 55, "P": 45, "K": 55, "ph": 7.0,
        "description": "Near rivers, very fertile, grayish color",
        "crops": ["Rice", "Wheat", "Sugarcane", "Vegetables"]
    }
}

# Water availability mapping
WATER_AVAILABILITY = {
    "very_less": {"rainfall": 50, "label": {"en": "Very Less", "hi": "बहुत कम", "te": "చాలా తక్కువ"}},
    "less": {"rainfall": 100, "label": {"en": "Less", "hi": "कम", "te": "తక్కువ"}},
    "normal": {"rainfall": 150, "label": {"en": "Normal", "hi": "सामान्य", "te": "సాధారణ"}},
    "good": {"rainfall": 250, "label": {"en": "Good", "hi": "अच्छा", "te": "మంచి"}},
    "heavy": {"rainfall": 400, "label": {"en": "Heavy", "hi": "भारी", "te": "భారీ"}}
}

# List of states and districts for dropdown
STATES_DISTRICTS = {
    "Telangana": [
        "Adilabad",
        "Bhadradri",
        "Hyderabad",
        "Jagtial",
        "Jangaon",
        "Jayashankar",
        "Jogulamba",
        "Kamareddy",
        "Karimnagar",
        "Khammam",
        "Komaram Bheem",
        "Mahabubabad",
        "Mahbubnagar",
        "Mancherial",
        "Medak",
        "Medchal-malkajgiri",
        "Nagarkurnool",
        "Nalgonda",
        "Nirmal",
        "Nizamabad",
        "Peddapalli",
        "Rajanna",
        "Rangareddy",
        "Sangareddy",
        "Siddipet",
        "Suryapet",
        "Vikarabad",
        "Wanaparthy",
        "Warangal",
        "Warangal Rural",
        "Warangal Urban",
        "Yadadri"
    ],
    "Andhra Pradesh": [
        "Anantapur",
        "Chittoor",
        "East Godavari",
        "Guntur",
        "Kadapa",
        "Krishna",
        "Kurnool",
        "Nellore",
        "Prakasam",
        "Sri Potti Sriramulu Nellore",
        "Srikakulam",
        "Tirupati",
        "Vijayawada",
        "Visakhapatnam",
        "Vizianagaram",
        "West Godavari",
        "Y.s.r."
    ],
    "Maharashtra": [
        "Ahmadnagar",
        "Akola",
        "Amravati",
        "Aurangabad",
        "Bhandara",
        "Bid",
        "Buldana",
        "Chandrapur",
        "Dhule",
        "Gadchiroli",
        "Gondiya",
        "Hingoli",
        "Jalgaon",
        "Jalna",
        "Kolhapur",
        "Latur",
        "Mumbai",
        "Mumbai Suburban",
        "Nagpur",
        "Nanded",
        "Nandurbar",
        "Nashik",
        "Osmanabad",
        "Palghar",
        "Parbhani",
        "Pune",
        "Raigarh",
        "Ratnagiri",
        "Sangli",
        "Satara",
        "Sindhudurg",
        "Solapur",
        "Thane",
        "Wardha",
        "Washim",
        "Yavatmal"
    ],
    "Karnataka": [
        "Bagalkot",
        "Bangalore",
        "Bangalore Rural",
        "Belgaum",
        "Bellary",
        "Bidar",
        "Bijapur",
        "Chamarajanagar",
        "Chikkaballapura",
        "Chikmagalur",
        "Chitradurga",
        "Dakshina Kannada",
        "Davanagere",
        "Davangere",
        "Dharwad",
        "Gadag",
        "Gulbarga",
        "Hassan",
        "Haveri",
        "Hubli",
        "Kodagu",
        "Kolar",
        "Koppal",
        "Mandya",
        "Mangalore",
        "Mysore",
        "Raichur",
        "Ramanagara",
        "Shimoga",
        "Tumkur",
        "Udupi",
        "Uttara Kannada",
        "Yadgir"
    ],
    "Tamil Nadu": [
        "Ariyalur",
        "Chennai",
        "Coimbatore",
        "Cuddalore",
        "Dharmapuri",
        "Dindigul",
        "Erode",
        "Kancheepuram",
        "Kanniyakumari",
        "Karur",
        "Krishnagiri",
        "Madurai",
        "Nagapattinam",
        "Namakkal",
        "Perambalur",
        "Pudukkottai",
        "Ramanathapuram",
        "Salem",
        "Sivaganga",
        "Thanjavur",
        "The Nilgiris",
        "Theni",
        "Thiruvallur",
        "Thiruvarur",
        "Thoothukkudi",
        "Tiruchirappalli",
        "Tirunelveli",
        "Tiruppur",
        "Tiruvannamalai",
        "Trichy",
        "Vellore",
        "Viluppuram",
        "Virudhunagar"
    ],
    "Punjab": [
        "Amritsar",
        "Barnala",
        "Bathinda",
        "Faridkot",
        "Fatehgarh Sahib",
        "Fazilka",
        "Firozpur",
        "Gurdaspur",
        "Hoshiarpur",
        "Jalandhar",
        "Kapurthala",
        "Ludhiana",
        "Mansa",
        "Moga",
        "Muktsar",
        "Pathankot",
        "Patiala",
        "Rupnagar",
        "Sahibzada Ajit Singh Nagar",
        "Sangrur",
        "Shahid Bhagat Singh Nagar",
        "Tarn Taran"
    ],
    "Haryana": [
        "Ambala",
        "Bhiwani",
        "Charkhi Dadri",
        "Faridabad",
        "Fatehabad",
        "Gurgaon",
        "Hisar",
        "Jhajjar",
        "Jind",
        "Kaithal",
        "Karnal",
        "Kurukshetra",
        "Mahendragarh",
        "Mewat",
        "Palwal",
        "Panchkula",
        "Panipat",
        "Rewari",
        "Rohtak",
        "Sirsa",
        "Sonipat",
        "Yamunanagar"
    ],
    "Uttar Pradesh": [
        "Agra",
        "Aligarh",
        "Allahabad",
        "Ambedkar Nagar",
        "Amethi",
        "Amroha",
        "Auraiya",
        "Azamgarh",
        "Baghpat",
        "Bahraich",
        "Ballia",
        "Balrampur",
        "Banda",
        "Bara Banki",
        "Bareilly",
        "Basti",
        "Bhadohi",
        "Bijnor",
        "Budaun",
        "Bulandshahr",
        "Chandauli",
        "Chitrakoot",
        "Deoria",
        "Etah",
        "Etawah",
        "Faizabad",
        "Farrukhabad",
        "Fatehpur",
        "Firozabad",
        "Gautam Buddha Nagar",
        "Ghaziabad",
        "Ghazipur",
        "Gonda",
        "Gorakhpur",
        "Hamirpur",
        "Hapur",
        "Hardoi",
        "Hathras",
        "Jalaun",
        "Jaunpur",
        "Jhansi",
        "Kannauj",
        "Kanpur",
        "Kanpur Dehat",
        "Kanpur Nagar",
        "Kasganj",
        "Kaushambi",
        "Kheri",
        "Kushinagar",
        "Lalitpur",
        "Lucknow",
        "Mahoba",
        "Mahrajganj",
        "Mainpuri",
        "Mathura",
        "Mau",
        "Meerut",
        "Mirzapur",
        "Moradabad",
        "Muzaffarnagar",
        "Pilibhit",
        "Pratapgarh",
        "Rae Bareli",
        "Rampur",
        "Saharanpur",
        "Sambhal",
        "Sant Kabir Nagar",
        "Shahjahanpur",
        "Shamli",
        "Shrawasti",
        "Siddharthnagar",
        "Sitapur",
        "Sonbhadra",
        "Sultanpur",
        "Unnao",
        "Varanasi"
    ],
    "Madhya Pradesh": [
        "Agar Malwa",
        "Alirajpur",
        "Anuppur",
        "Ashoknagar",
        "Balaghat",
        "Barwani",
        "Betul",
        "Bhind",
        "Bhopal",
        "Burhanpur",
        "Chhatarpur",
        "Chhindwara",
        "Damoh",
        "Datia",
        "Dewas",
        "Dhar",
        "Dindori",
        "Guna",
        "Gwalior",
        "Harda",
        "Hoshangabad",
        "Indore",
        "Jabalpur",
        "Jhabua",
        "Katni",
        "Khandwa (east Nimar)",
        "Khargone (west Nimar)",
        "Mandla",
        "Mandsaur",
        "Morena",
        "Narsimhapur",
        "Neemuch",
        "Panna",
        "Raisen",
        "Rajgarh",
        "Ratlam",
        "Rewa",
        "Sagar",
        "Satna",
        "Sehore",
        "Seoni",
        "Shahdol",
        "Shajapur",
        "Sheopur",
        "Shivpuri",
        "Sidhi",
        "Singrauli",
        "Tikamgarh",
        "Ujjain",
        "Umaria",
        "Vidisha"
    ],
    "Rajasthan": [
        "Ajmer",
        "Alwar",
        "Banswara",
        "Baran",
        "Barmer",
        "Bharatpur",
        "Bhilwara",
        "Bikaner",
        "Bundi",
        "Chittaurgarh",
        "Churu",
        "Dausa",
        "Dhaulpur",
        "Dungarpur",
        "Hanumangarh",
        "Jaipur",
        "Jaisalmer",
        "Jalor",
        "Jhalawar",
        "Jhunjhunun",
        "Jodhpur",
        "Karauli",
        "Kota",
        "Nagaur",
        "Pali",
        "Pratapgarh",
        "Rajsamand",
        "Sawai Madhopur",
        "Sikar",
        "Sirohi",
        "Sri Ganganagar",
        "Tonk",
        "Udaipur"
    ],
    "Gujarat": [
        "Ahmadabad",
        "Ahmedabad",
        "Amreli",
        "Anand",
        "Arvalli",
        "Banas Kantha",
        "Bharuch",
        "Bhavnagar",
        "Botad",
        "Chhota Udepur",
        "Devbhoomi Dwarka",
        "Dohad",
        "Gandhinagar",
        "Gir Somnath",
        "Jamnagar",
        "Junagadh",
        "Kachchh",
        "Kheda",
        "Mahesana",
        "Mahisagar",
        "Morbi",
        "Narmada",
        "Navsari",
        "Panch Mahals",
        "Patan",
        "Porbandar",
        "Rajkot",
        "Sabar Kantha",
        "Surat",
        "Surendranagar",
        "Tapi",
        "The Dangs",
        "Vadodara",
        "Valsad"
    ],
    "West Bengal": [
        "Alipurduar",
        "Bankura",
        "Barddhaman",
        "Birbhum",
        "Dakshin Dinajpur",
        "Darjeeling",
        "Darjiling",
        "Haora",
        "Howrah",
        "Hugli",
        "Jalpaiguri",
        "Jhargram",
        "Kalimpong",
        "Koch Bihar",
        "Kolkata",
        "Maldah",
        "Murshidabad",
        "Nadia",
        "North Twenty Four Parganas",
        "Paschim Bardhaman",
        "Paschim Medinipur",
        "Purba Bardhaman",
        "Purba Medinipur",
        "Puruliya",
        "South Twenty Four Parganas",
        "Uttar Dinajpur"
    ],
    "Bihar": [
        "Araria",
        "Arwal",
        "Aurangabad",
        "Banka",
        "Begusarai",
        "Bhagalpur",
        "Bhojpur",
        "Buxar",
        "Darbhanga",
        "Gaya",
        "Gopalganj",
        "Jamui",
        "Jehanabad",
        "Kaimur (bhabua)",
        "Katihar",
        "Khagaria",
        "Kishanganj",
        "Lakhisarai",
        "Madhepura",
        "Madhubani",
        "Munger",
        "Muzaffarpur",
        "Nalanda",
        "Nawada",
        "Pashchim Champaran",
        "Patna",
        "Purbi Champaran",
        "Purnia",
        "Rohtas",
        "Saharsa",
        "Samastipur",
        "Saran",
        "Sheikhpura",
        "Sheohar",
        "Sitamarhi",
        "Siwan",
        "Supaul",
        "Vaishali"
    ],
    "Odisha": [
        "Anugul",
        "Balangir",
        "Baleshwar",
        "Bargarh",
        "Baudh",
        "Bhadrak",
        "Bhubaneswar",
        "Cuttack",
        "Debagarh",
        "Dhenkanal",
        "Gajapati",
        "Ganjam",
        "Jagatsinghapur",
        "Jajapur",
        "Jharsuguda",
        "Kalahandi",
        "Kandhamal",
        "Kendrapara",
        "Kendujhar",
        "Khordha",
        "Koraput",
        "Malkangiri",
        "Mayurbhanj",
        "Nabarangapur",
        "Nayagarh",
        "Nuapada",
        "Puri",
        "Rayagada",
        "Sambalpur",
        "Subarnapur",
        "Sundargarh"
    ],
    "Kerala": [
        "Alappuzha",
        "Ernakulam",
        "Idukki",
        "Kannur",
        "Kasaragod",
        "Kochi",
        "Kollam",
        "Kottayam",
        "Kozhikode",
        "Malappuram",
        "Palakkad",
        "Pathanamthitta",
        "Thiruvananthapuram",
        "Thrissur",
        "Wayanad"
    ],
    "Andaman and Nicobar Islands": [
        "Nicobars",
        "North and Middle Andaman",
        "South Andaman"
    ],
    "Arunachal Pradesh": [
        "Anjaw",
        "Changlang",
        "Dibang Valley",
        "East Kameng",
        "East Siang",
        "Kra Daadi",
        "Kurung Kumey",
        "Lohit",
        "Lower Dibang Valley",
        "Lower Siang",
        "Lower Subansiri",
        "Namsai",
        "Papum Pare",
        "Siang",
        "Tawang",
        "Tirap",
        "Upper Siang",
        "Upper Subansiri",
        "West Kameng",
        "West Siang"
    ],
    "Assam": [
        "Baksa",
        "Barpeta",
        "Biswanath",
        "Bongaigaon",
        "Cachar",
        "Charaideo",
        "Chirang",
        "Darrang",
        "Dhemaji",
        "Dhubri",
        "Dibrugarh",
        "Dima Hasao",
        "Goalpara",
        "Golaghat",
        "Hailakandi",
        "Hojai",
        "Jorhat",
        "Kamrup",
        "Kamrup Metropolitan",
        "Karbi Anglong",
        "Karimganj",
        "Kokrajhar",
        "Lakhimpur",
        "Majuli",
        "Morigaon",
        "Nagaon",
        "Nalbari",
        "Sivasagar",
        "Sonitpur",
        "South Salamara-mankachar",
        "Tinsukia",
        "Udalguri",
        "West Karbi Anglong"
    ],
    "Chandigarh": [
        "Chandigarh"
    ],
    "Chhattisgarh": [
        "Balod",
        "Baloda Bazar",
        "Balrampur",
        "Bastar",
        "Bemetara",
        "Bijapur",
        "Bilaspur",
        "Dakshin Bastar Dantewada",
        "Dhamtari",
        "Durg",
        "Gariyaband",
        "Janjgir - Champa",
        "Jashpur",
        "Kabeerdham",
        "Kondagaon",
        "Korba",
        "Koriya",
        "Mahasamund",
        "Mungeli",
        "Narayanpur",
        "Raigarh",
        "Raipur",
        "Rajnandgaon",
        "Sukma",
        "Surajpur",
        "Surguja",
        "Uttar Bastar Kanker"
    ],
    "Dadra and Nagar Haveli": [
        "Dadra and Nagar Haveli"
    ],
    "Daman and Diu": [
        "Daman",
        "Diu"
    ],
    "Goa": [
        "North Goa",
        "South Goa"
    ],
    "Himachal Pradesh": [
        "Bilaspur",
        "Chamba",
        "Hamirpur",
        "Kangra",
        "Kinnaur",
        "Kullu",
        "Lahul Spiti",
        "Mandi",
        "Shimla",
        "Sirmaur",
        "Solan",
        "Una"
    ],
    "Jammu and Kashmir": [
        "Anantnag",
        "Badgam",
        "Bandipore",
        "Baramula",
        "Doda",
        "Ganderbal",
        "Jammu",
        "Kargil",
        "Kathua",
        "Kishtwar",
        "Kulgam",
        "Kupwara",
        "Leh(ladakh)",
        "Pulwama",
        "Punch",
        "Rajouri",
        "Ramban",
        "Reasi",
        "Samba",
        "Shupiyan",
        "Srinagar",
        "Udhampur"
    ],
    "Jharkhand": [
        "Bokaro",
        "Chatra",
        "Deoghar",
        "Dhanbad",
        "Dumka",
        "Garhwa",
        "Giridih",
        "Godda",
        "Gumla",
        "Hazaribagh",
        "Jamtara",
        "Khunti",
        "Kodarma",
        "Latehar",
        "Lohardaga",
        "Pakur",
        "Palamu",
        "Pashchimi Singhbhum",
        "Purbi Singhbhum",
        "Ramgarh",
        "Ranchi",
        "Sahibganj",
        "Saraikela-kharsawan",
        "Simdega"
    ],
    "Lakshadweep": [
        "Lakshadweep"
    ],
    "Manipur": [
        "Bishnupur",
        "Chandel",
        "Churachandpur",
        "Imphal East",
        "Imphal West",
        "Jiribam",
        "Kakching",
        "Kamjong",
        "Kangpokpi",
        "Noney",
        "Pherzawl",
        "Senapati",
        "Tamenglong",
        "Tengnoupal",
        "Thoubal",
        "Ukhrul"
    ],
    "Meghalaya": [
        "East Garo Hills",
        "East Jaintia Hills",
        "East Khasi Hills",
        "Jaintia Hills",
        "North Garo Hills",
        "Ribhoi",
        "South Garo Hills",
        "South West Garo Hills",
        "South West Khasi Hills",
        "West Garo Hills",
        "West Jaintia Hills",
        "West Khasi Hills"
    ],
    "Mizoram": [
        "Aizawl",
        "Champhai",
        "Kolasib",
        "Lawngtlai",
        "Lunglei",
        "Mamit",
        "Saiha",
        "Serchhip"
    ],
    "Nagaland": [
        "Dimapur",
        "Kiphire",
        "Kohima",
        "Longleng",
        "Mokokchung",
        "Mon",
        "Peren",
        "Phek",
        "Tuensang",
        "Wokha",
        "Zunheboto"
    ],
    "Delhi": [
        "Central",
        "East",
        "New Delhi",
        "North",
        "North East",
        "North West",
        "Shahdara",
        "South",
        "South East Delhi",
        "South West",
        "West"
    ],
    "Puducherry": [
        "Karaikal",
        "Mahe",
        "Puducherry",
        "Yanam"
    ],
    "Sikkim": [
        "East District",
        "North  District",
        "South District",
        "West District"
    ],
    "Tripura": [
        "Dhalai",
        "Gomati",
        "Khowai",
        "North Tripura",
        "Sepahijala",
        "South Tripura",
        "Unakoti",
        "West Tripura"
    ],
    "Uttarakhand": [
        "Almora",
        "Bageshwar",
        "Chamoli",
        "Champawat",
        "Dehradun",
        "Garhwal",
        "Hardwar",
        "Nainital",
        "Pithoragarh",
        "Rudraprayag",
        "Tehri Garhwal",
        "Udham Singh Nagar",
        "Uttarkashi"
    ]
}


def get_weather_by_coordinates(lat, lon):
    """
    Fetch current weather data using coordinates.
    Uses OpenWeatherMap free API.
    """
    try:
        # Using a free weather API (OpenWeatherMap)
        api_key = os.getenv('OPENWEATHER_API_KEY')
        
        # If no API key or demo key, return average values based on season
        if api_key == 'demo' or not api_key:
            import datetime
            month = datetime.datetime.now().month
            
            # Seasonal defaults for India
            if month in [12, 1, 2]:  # Winter
                return {"temperature": 20, "humidity": 60, "rainfall": 20}
            elif month in [3, 4, 5]:  # Summer
                return {"temperature": 35, "humidity": 40, "rainfall": 10}
            elif month in [6, 7, 8, 9]:  # Monsoon
                return {"temperature": 28, "humidity": 85, "rainfall": 250}
            else:  # Post-monsoon
                return {"temperature": 25, "humidity": 70, "rainfall": 50}
        
        url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={api_key}&units=metric"
        response = requests.get(url, timeout=5)
        
        if response.status_code == 200:
            data = response.json()
            return {
                "temperature": data["main"]["temp"],
                "humidity": data["main"]["humidity"],
                "rainfall": data.get("rain", {}).get("1h", 0) * 24 * 30  # Estimate monthly
            }
    except Exception as e:
        print(f"Weather API error: {e}")
    
    # Default fallback
    return {"temperature": 25, "humidity": 70, "rainfall": 100}


def get_weather_by_location(state, district):
    """
    Get weather data based on state and district.
    Uses predefined coordinates for major cities.
    """
    # Coordinates for major cities
    CITY_COORDINATES = {
        ("Telangana", "Hyderabad"): (17.385, 78.4867),
        ("Maharashtra", "Pune"): (18.5204, 73.8567),
        ("Karnataka", "Bangalore"): (12.9716, 77.5946),
        ("Tamil Nadu", "Chennai"): (13.0827, 80.2707),
        ("Andhra Pradesh", "Vijayawada"): (16.5062, 80.6480),
        # Add more as needed
    }
    
    coords = CITY_COORDINATES.get((state, district))
    if coords:
        return get_weather_by_coordinates(coords[0], coords[1])
    
    # Return seasonal defaults
    return get_weather_by_coordinates(20, 78)


def get_regional_soil_data(state, district):
    """
    Get average soil data for a region.
    Returns estimated N, P, K, pH values.
    """
    data = REGIONAL_SOIL_DATA.get((state, district))
    if data:
        return {
            "success": True,
            "N": data["N"],
            "P": data["P"],
            "K": data["K"],
            "ph": data["ph"],
            "soil_type": data["soil_type"],
            "source": "Regional average data"
        }
    
    # Return state-level average if district not found
    state_data = [v for k, v in REGIONAL_SOIL_DATA.items() if k[0] == state]
    if state_data:
        avg_n = sum(d["N"] for d in state_data) / len(state_data)
        avg_p = sum(d["P"] for d in state_data) / len(state_data)
        avg_k = sum(d["K"] for d in state_data) / len(state_data)
        avg_ph = sum(d["ph"] for d in state_data) / len(state_data)
        
        return {
            "success": True,
            "N": round(avg_n),
            "P": round(avg_p),
            "K": round(avg_k),
            "ph": round(avg_ph, 1),
            "soil_type": "mixed",
            "source": "State average data"
        }
    
    # Default fallback
    return {
        "success": True,
        "N": 40,
        "P": 35,
        "K": 40,
        "ph": 7.0,
        "soil_type": "unknown",
        "source": "Default values"
    }


def get_soil_data_by_type(soil_type):
    """
    Get NPK values based on visual soil type selection.
    """
    data = SOIL_TYPE_DATA.get(soil_type)
    if data:
        return {
            "success": True,
            "N": data["N"],
            "P": data["P"],
            "K": data["K"],
            "ph": data["ph"],
            "name": data["name"],
            "description": data["description"],
            "recommended_crops": data["crops"]
        }
    
    return {
        "success": False,
        "error": "Unknown soil type"
    }


def convert_simple_to_technical(simple_input):
    """
    Convert farmer-friendly inputs to technical values.
    """
    result = {}
    
    # Convert soil type
    if "soil_type" in simple_input:
        soil_data = get_soil_data_by_type(simple_input["soil_type"])
        if soil_data["success"]:
            result["N"] = soil_data["N"]
            result["P"] = soil_data["P"]
            result["K"] = soil_data["K"]
            result["ph"] = soil_data["ph"]
    
    # Convert water availability
    if "water" in simple_input:
        water_data = WATER_AVAILABILITY.get(simple_input["water"], WATER_AVAILABILITY["normal"])
        result["rainfall"] = water_data["rainfall"]
    
    # Get weather from location
    if "state" in simple_input and "district" in simple_input:
        weather = get_weather_by_location(simple_input["state"], simple_input["district"])
        result["temperature"] = weather["temperature"]
        result["humidity"] = weather["humidity"]
        if "rainfall" not in result:
            result["rainfall"] = weather["rainfall"]
        
        # Also get regional soil data if not provided
        if "N" not in result:
            soil = get_regional_soil_data(simple_input["state"], simple_input["district"])
            result["N"] = soil["N"]
            result["P"] = soil["P"]
            result["K"] = soil["K"]
            result["ph"] = soil["ph"]
    
    return result


def get_location_details(lat, lon):
    """
    Reverse geocode coordinates using Google Maps Geocoding API.
    """
    try:
        api_key = os.getenv('GOOGLE_MAPS_API_KEY')
        if not api_key:
            return {"success": False, "error": "Geocoding API Key not configured"}
            
        url = f"https://maps.googleapis.com/maps/api/geocode/json?latlng={lat},{lon}&key={api_key}"
        response = requests.get(url, timeout=5)
        
        if response.status_code == 200:
            data = response.json()
            if data.get('results') and len(data['results']) > 0:
                components = data['results'][0].get('address_components', [])
                
                state = ""
                district = ""
                city = ""
                mandal = ""
                
                for component in components:
                    types = component.get('types', [])
                    if 'administrative_area_level_1' in types:
                        state = component.get('long_name', '')
                    elif 'administrative_area_level_2' in types:
                        district = component.get('long_name', '')
                    elif 'locality' in types:
                        city = component.get('long_name', '')
                    elif 'administrative_area_level_3' in types or 'sublocality' in types:
                        mandal = component.get('long_name', '')
                
                if not district and city:
                    district = city
                    
                return {
                    "success": True,
                    "state": state,
                    "district": district,
                    "city": city,
                    "mandal": mandal,
                    "formatted_address": data['results'][0].get('formatted_address', '')
                }
        return {"success": False, "error": "No results found"}
    except Exception as e:
        print(f"Geocoding API error: {e}")
        return {"success": False, "error": str(e)}
