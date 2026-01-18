import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { useTranslation } from 'react-i18next';

const PersonalInfo = () => {
  const { t } = useTranslation();
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [personalInfo, setPersonalInfo] = useState({
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    farm_size: '',
    crops_grown: [],
    soil_type: '',
    irrigation_type: '',
  });

  useEffect(() => {
    if (user?.personal_info) {
      setPersonalInfo({
        phone: user.personal_info.phone || '',
        address: user.personal_info.address || '',
        city: user.personal_info.city || '',
        state: user.personal_info.state || '',
        pincode: user.personal_info.pincode || '',
        farm_size: user.personal_info.farm_size || '',
        crops_grown: user.personal_info.crops_grown || [],
        soil_type: user.personal_info.soil_type || '',
        irrigation_type: user.personal_info.irrigation_type || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleCropsChange = (e) => {
    const crops = e.target.value.split(',').map(crop => crop.trim()).filter(Boolean);
    setPersonalInfo(prev => ({ ...prev, crops_grown: crops }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/personal-info`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(personalInfo)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: t('personalInfoUpdated') || 'Personal information updated successfully!' });
      } else {
        setMessage({ type: 'error', text: data.msg || 'Failed to update information' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6 text-green-800">
          {t('personalInformation') || 'Personal Information'}
        </h2>

        {message.text && (
          <div className={`p-4 mb-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                {t('phone') || 'Phone Number'}
              </label>
              <Input
                type="tel"
                name="phone"
                value={personalInfo.phone}
                onChange={handleChange}
                placeholder="+91 1234567890"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {t('farmSize') || 'Farm Size (acres)'}
              </label>
              <Input
                type="text"
                name="farm_size"
                value={personalInfo.farm_size}
                onChange={handleChange}
                placeholder="10"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              {t('address') || 'Address'}
            </label>
            <Input
              type="text"
              name="address"
              value={personalInfo.address}
              onChange={handleChange}
              placeholder="Street address"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                {t('city') || 'City'}
              </label>
              <Input
                type="text"
                name="city"
                value={personalInfo.city}
                onChange={handleChange}
                placeholder="City"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {t('state') || 'State'}
              </label>
              <Input
                type="text"
                name="state"
                value={personalInfo.state}
                onChange={handleChange}
                placeholder="State"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {t('pincode') || 'Pincode'}
              </label>
              <Input
                type="text"
                name="pincode"
                value={personalInfo.pincode}
                onChange={handleChange}
                placeholder="123456"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              {t('cropsGrown') || 'Crops Grown (comma separated)'}
            </label>
            <Input
              type="text"
              name="crops_grown"
              value={personalInfo.crops_grown.join(', ')}
              onChange={handleCropsChange}
              placeholder="Rice, Wheat, Cotton"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                {t('soilType') || 'Soil Type'}
              </label>
              <select
                name="soil_type"
                value={personalInfo.soil_type}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Select soil type</option>
                <option value="clay">Clay</option>
                <option value="sandy">Sandy</option>
                <option value="loamy">Loamy</option>
                <option value="black">Black</option>
                <option value="red">Red</option>
                <option value="alluvial">Alluvial</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {t('irrigationType') || 'Irrigation Type'}
              </label>
              <select
                name="irrigation_type"
                value={personalInfo.irrigation_type}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Select irrigation type</option>
                <option value="drip">Drip Irrigation</option>
                <option value="sprinkler">Sprinkler</option>
                <option value="canal">Canal</option>
                <option value="well">Well/Borewell</option>
                <option value="rainfed">Rainfed</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <Button type="submit" disabled={loading}>
              {loading ? t('updating') || 'Updating...' : t('updateInfo') || 'Update Information'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default PersonalInfo;
