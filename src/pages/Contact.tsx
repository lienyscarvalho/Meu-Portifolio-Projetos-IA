import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle, AlertCircle, CheckCircle2, Globe, Camera } from 'lucide-react';

export const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'Consulta Jurídica', message: '' });
  const [errors, setErrors] = useState({ name: '', email: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = () => {
    let isValid = true;
    const newErrors = { name: '', email: '', message: '' };
    if (!formData.name.trim()) { newErrors.name = 'O nome é obrigatório'; isValid = false; }
    if (!formData.email.trim()) { newErrors.email = 'O e-mail é obrigatório'; isValid = false; }
    if (!formData.message.trim()) { newErrors.message = 'A mensagem é obrigatória'; isValid = false; }
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: 'Consulta Jurídica', message: '' });
      setTimeout(() => setIsSubmitted(false), 5000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-12">
      <div className="text-center">
        <h1 className="text-4xl font-serif font-bold">Fale Conosco</h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-brand-blue p-8 rounded-3xl text-white">
          <h3 className="text-xl font-bold mb-6">Contato</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3"><MapPin className="text-brand-gold" /> <span>Niterói - RJ</span></div>
            <div className="flex items-center gap-3"><Camera className="text-brand-gold" /> <span>@francaemiranda.adv</span></div>
            <div className="flex items-center gap-3"><Phone className="text-brand-gold" /> <span>(21) 3333-4444</span></div>
          </div>
        </div>
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border">
          {isSubmitted ? <div className="text-center py-8"><CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" /> <p>Enviado!</p></div> : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input name="name" value={formData.name} onChange={handleChange} placeholder="Nome" className="w-full p-3 border rounded-xl" />
              <input name="email" value={formData.email} onChange={handleChange} placeholder="E-mail" className="w-full p-3 border rounded-xl" />
              <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Mensagem" className="w-full p-3 border rounded-xl" rows={4} />
              <button type="submit" className="w-full bg-brand-blue text-white py-3 rounded-xl font-bold">Enviar</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
