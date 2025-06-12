
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, User, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const OrderPage = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState({
    fullName: '',
    email: '',
    phone: '',
    message: ''
  });

  // Mock video data - in real app, fetch based on videoId
  const video = {
    id: videoId,
    title: 'Formation Coran - Niveau Débutant',
    author: 'Professeur Ahmed',
    price: 49.99,
    description: 'Apprenez les bases de la lecture du Coran avec cette formation complète.',
    thumbnail: '/placeholder.svg'
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Commande soumise:', { video, orderData });
    
    // In real app, send to backend
    alert('Votre commande a été soumise! Un administrateur va l\'examiner et vous contacter bientôt.');
    navigate('/');
  };

  const handleInputChange = (field: string, value: string) => {
    setOrderData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-md mx-auto bg-background min-h-screen">
      {/* Header */}
      <div className="p-4 pt-16 bg-primary text-primary-foreground">
        <div className="flex items-center space-x-3">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(-1)}
            className="text-primary-foreground hover:bg-primary-foreground/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">Passer une commande</h1>
            <p className="text-primary-foreground/80 text-sm">Approbation manuelle requise</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Formation Info */}
        <Card>
          <CardContent className="p-4">
            <div className="flex space-x-3">
              <img 
                src={video.thumbnail} 
                alt={video.title}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{video.title}</h3>
                <p className="text-sm text-muted-foreground">{video.author}</p>
                <p className="text-lg font-bold text-primary">{video.price}€</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ShoppingCart className="w-5 h-5" />
              <span>Informations de commande</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>Nom complet *</span>
                </label>
                <Input
                  required
                  value={orderData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder="Votre nom complet"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>Email *</span>
                </label>
                <Input
                  type="email"
                  required
                  value={orderData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="votre@email.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>Téléphone *</span>
                </label>
                <Input
                  type="tel"
                  required
                  value={orderData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+33 6 12 34 56 78"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Message (optionnel)
                </label>
                <Textarea
                  value={orderData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  placeholder="Des questions ou des commentaires..."
                  rows={3}
                />
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> Votre commande sera examinée manuellement par un administrateur. 
                  Vous recevrez une confirmation par email une fois approuvée.
                </p>
              </div>

              <Button type="submit" className="w-full" size="lg">
                Soumettre la commande - {video.price}€
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrderPage;
