import React, { useState, useEffect } from 'react';
import { Property } from '../types';
import { XIcon, EditIcon } from './icons';

interface EditPropertyModalProps {
  property: Property;
  onClose: () => void;
  onUpdateProperty: (propertyData: Property) => void;
}

const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const inputStyle = "mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 dark:text-gray-200";
const labelStyle = "block text-sm font-medium text-gray-700 dark:text-gray-300";

export const EditPropertyModal: React.FC<EditPropertyModalProps> = ({ property, onClose, onUpdateProperty }) => {
  const [formData, setFormData] = useState(property);

  useEffect(() => {
    setFormData(property);
  }, [property]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({ ...prev, [parent]: { ...(prev as any)[parent], [child]: value } }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const dataUrl = await fileToDataUrl(e.target.files[0]);
      setFormData(prev => ({...prev, imageUrl: dataUrl}));
    }
  }
  
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const dataUrls = await Promise.all(files.map(fileToDataUrl));
      setFormData(prev => ({...prev, gallery: [...prev.gallery, ...dataUrls]}));
    }
  }

  const handleAmenitiesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amenities = e.target.value.split(',').map(item => item.trim()).filter(Boolean);
    setFormData(prev => ({ ...prev, amenities }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProperty({
        ...formData,
        price: Number(formData.price),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        area: Number(formData.area),
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-3xl transform transition-all" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <EditIcon className="w-6 h-6 text-blue-500 mr-3" />
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Editar Imóvel</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <XIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            {/* --- Basic Info --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelStyle}>Título do Imóvel</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} required className={inputStyle} />
              </div>
              <div>
                <label className={labelStyle}>Preço (R$)</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} required className={inputStyle} />
              </div>
              <div>
                <label className={labelStyle}>Tipo</label>
                <select name="type" value={formData.type} onChange={handleChange} className={inputStyle}>
                    <option value="Apartment">Apartamento</option>
                    <option value="House">Casa</option>
                    <option value="Penthouse">Cobertura</option>
                </select>
              </div>
            </div>
            {/* --- Address --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className={labelStyle}>Rua</label>
                <input type="text" name="address.street" value={formData.address.street} onChange={handleChange} className={inputStyle} />
              </div>
              <div>
                <label className={labelStyle}>CEP</label>
                <input type="text" name="address.zipCode" value={formData.address.zipCode} onChange={handleChange} className={inputStyle} />
              </div>
              <div>
                <label className={labelStyle}>Cidade</label>
                <input type="text" name="address.city" value={formData.address.city} onChange={handleChange} className={inputStyle} />
              </div>
              <div>
                <label className={labelStyle}>Estado</label>
                <input type="text" name="address.state" value={formData.address.state} onChange={handleChange} className={inputStyle} />
              </div>
            </div>
             {/* --- Details --- */}
            <div className="grid grid-cols-3 gap-4">
                <div><label className={labelStyle}>Quartos</label><input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} className={inputStyle} /></div>
                <div><label className={labelStyle}>Banheiros</label><input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleChange} className={inputStyle} /></div>
                <div><label className={labelStyle}>Área (m²)</label><input type="number" name="area" value={formData.area} onChange={handleChange} className={inputStyle} /></div>
            </div>
            {/* --- Description & Amenities --- */}
            <div>
              <label className={labelStyle}>Descrição</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className={inputStyle} />
            </div>
            <div>
              <label className={labelStyle}>Comodidades (separadas por vírgula)</label>
              <input type="text" name="amenities" value={formData.amenities.join(', ')} onChange={handleAmenitiesChange} className={inputStyle} />
            </div>
            {/* --- Image Uploads --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className={labelStyle}>Imagem Principal</label>
                    <input type="file" accept="image/*" onChange={handleMainImageUpload} className="mt-1 block w-full text-sm text-gray-500 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 dark:file:bg-blue-900/50 file:text-blue-700 dark:file:text-blue-300 hover:file:bg-blue-100 dark:hover:file:bg-blue-900"/>
                    {formData.imageUrl && <img src={formData.imageUrl} alt="preview" className="mt-2 w-32 h-32 object-cover rounded-md"/>}
                </div>
                <div>
                    <label className={labelStyle}>Galeria de Imagens</label>
                    <input type="file" accept="image/*" multiple onChange={handleGalleryUpload} className="mt-1 block w-full text-sm text-gray-500 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 dark:file:bg-blue-900/50 file:text-blue-700 dark:file:text-blue-300 hover:file:bg-blue-100 dark:hover:file:bg-blue-900"/>
                    <div className="flex space-x-2 mt-2 overflow-x-auto">
                        {formData.gallery.map((img, i) => <img key={i} src={img} alt={`gallery ${i}`} className="w-20 h-20 object-cover rounded-md"/>)}
                    </div>
                </div>
            </div>
          </div>

          <div className="flex justify-end items-center p-5 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 rounded-b-lg space-x-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white dark:text-gray-200 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-500">Cancelar</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Salvar Alterações</button>
          </div>
        </form>
      </div>
    </div>
  );
};