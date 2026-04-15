import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Loader2, Check } from 'lucide-react';
import { cn } from '../lib/utils';
import { useLocationData } from '../context/LocationContext';

// States and districts data
const STATES_DISTRICTS = {
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
};

const LocationSelector = ({ 
    selectedState, 
    selectedDistrict, 
    onStateChange, 
    onDistrictChange,
    onAutoFill,
    loading = false 
}) => {
    const { isLocating, fetchLocationAndData, fetchLocationByAddress, address, weather } = useLocationData();
    const [districts, setDistricts] = useState([]);

    // Update districts when state changes
    useEffect(() => {
        if (selectedState && STATES_DISTRICTS[selectedState]) {
            setDistricts(STATES_DISTRICTS[selectedState]);
            // Reset district if current selection is not in new state
            if (!STATES_DISTRICTS[selectedState].includes(selectedDistrict)) {
                onDistrictChange('');
            }
        } else {
            setDistricts([]);
        }
    }, [selectedState]);

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">📍</span>
                <div>
                    <h3 className="font-semibold text-gray-900">Where is your farm?</h3>
                    <p className="text-sm text-gray-500">आपका खेत कहाँ है? / మీ పొలం ఎక్కడ ఉంది?</p>
                </div>
            </div>

            {/* GPS Button */}
            <motion.button
                type="button"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={fetchLocationAndData}
                disabled={isLocating}
                className={cn(
                    "w-full p-3 rounded-xl border-2 border-dashed",
                    "flex items-center justify-center gap-2",
                    "text-emerald-600 border-emerald-300 bg-emerald-50/50",
                    "hover:bg-emerald-100 hover:border-emerald-400",
                    "transition-all duration-200",
                    isLocating && "opacity-70 cursor-not-allowed"
                )}
            >
                {isLocating ? (
                    <Loader2 size={20} className="animate-spin" />
                ) : (
                    <Navigation size={20} />
                )}
                <span className="font-medium">
                    {isLocating ? 'Detecting Location...' : 'Use My Location (GPS)'}
                </span>
            </motion.button>

            <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-sm text-gray-400">or select manually</span>
                <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* State & District Dropdowns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                        State (राज्य / రాష్ట్రం)
                    </label>
                    <select
                        value={selectedState}
                        onChange={(e) => onStateChange(e.target.value)}
                        className={cn(
                            "w-full p-3 rounded-xl border border-gray-200",
                            "bg-white text-gray-900",
                            "focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500",
                            "transition-all duration-200"
                        )}
                    >
                        <option value="">Select State</option>
                        {Object.keys(STATES_DISTRICTS).map(state => (
                            <option key={state} value={state}>{state}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                        District (जिला / జిల్లా)
                    </label>
                    <select
                        value={selectedDistrict}
                        onChange={(e) => onDistrictChange(e.target.value)}
                        disabled={!selectedState}
                        className={cn(
                            "w-full p-3 rounded-xl border border-gray-200",
                            "bg-white text-gray-900",
                            "focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500",
                            "transition-all duration-200",
                            !selectedState && "opacity-50 cursor-not-allowed"
                        )}
                    >
                        <option value="">Select District</option>
                        {districts.map(district => (
                            <option key={district} value={district}>{district}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Auto-fill button */}
            {selectedState && selectedDistrict && (
                <motion.button
                    type="button"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => fetchLocationByAddress(selectedState, selectedDistrict)}
                    disabled={isLocating}
                    className={cn(
                        "w-full p-3 rounded-xl",
                        "flex items-center justify-center gap-2",
                        "bg-gradient-to-r from-emerald-500 to-teal-500 text-white",
                        "hover:from-emerald-600 hover:to-teal-600",
                        "shadow-lg shadow-emerald-500/20",
                        "transition-all duration-200",
                        isLocating && "opacity-70 cursor-not-allowed"
                    )}
                >
                    {isLocating ? (
                        <Loader2 size={20} className="animate-spin" />
                    ) : (
                        <MapPin size={20} />
                    )}
                    <span className="font-medium">
                        {isLocating ? 'Getting Data...' : 'Auto-Fill Environment Data'}
                    </span>
                </motion.button>
            )}

            {/* Auto-filled data display */}
            {weather && address && address.state === selectedState && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-gradient-to-br from-blue-50 to-emerald-50 rounded-xl border border-blue-200"
                >
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <Check size={18} className="text-emerald-500" />
                            <span className="font-medium text-gray-900">Environment Data Synced!</span>
                        </div>
                        {weather.timestamp && (
                            <span className="text-xs text-gray-500 font-medium bg-white/50 px-2 py-1 rounded-md">
                                Last Updated: {weather.timestamp}
                            </span>
                        )}
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3 text-sm">
                        <div className="p-2 bg-white/60 rounded-lg">
                            <p className="text-gray-500">🌡️ Temperature</p>
                            <p className="font-semibold">{weather.temperature}°C</p>
                        </div>
                        <div className="p-2 bg-white/60 rounded-lg">
                            <p className="text-gray-500">💧 Humidity</p>
                            <p className="font-semibold">{weather.humidity}%</p>
                        </div>
                        <div className="p-2 bg-white/60 rounded-lg">
                            <p className="text-gray-500">🌧️ Rainfall</p>
                            <p className="font-semibold">{weather.rainfall} mm</p>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default LocationSelector;
export { STATES_DISTRICTS };
