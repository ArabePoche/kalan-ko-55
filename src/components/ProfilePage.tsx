
import { useState } from 'react';
import { User, BookOpen, ShoppingBag, Wallet, Settings, Edit, Trophy, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'orders' | 'wallet'>('overview');

  const userProfile = {
    name: 'Ahmed Benali',
    email: 'ahmed.benali@example.com',
    avatar: '/placeholder.svg',
    joinDate: '15 janvier 2024',
    totalCourses: 3,
    completedCourses: 1,
    totalSpent: 129.97,
    walletBalance: 25.50
  };

  const myCourses = [
    {
      id: '1',
      title: 'Formation Coran Complet',
      progress: 65,
      status: 'En cours',
      purchaseDate: '15 janvier 2024'
    },
    {
      id: '2',
      title: 'Sciences Islamiques',
      progress: 100,
      status: 'Terminé',
      purchaseDate: '10 février 2024'
    },
    {
      id: '3',
      title: 'Langue Arabe Débutant',
      progress: 25,
      status: 'En cours',
      purchaseDate: '1 mars 2024'
    }
  ];

  const orders = [
    {
      id: 'CMD-001',
      course: 'Formation Coran Complet',
      amount: 49.99,
      date: '15 janvier 2024',
      status: 'Validé'
    },
    {
      id: 'CMD-002',
      course: 'Sciences Islamiques',
      amount: 79.99,
      date: '10 février 2024',
      status: 'Validé'
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: User },
    { id: 'courses', label: 'Mes Cours', icon: BookOpen },
    { id: 'orders', label: 'Commandes', icon: ShoppingBag },
    { id: 'wallet', label: 'Portefeuille', icon: Wallet },
  ];

  return (
    <div className="max-w-md mx-auto bg-background min-h-screen">
      {/* Header */}
      <div className="p-4 pt-16 bg-primary text-primary-foreground">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-primary-foreground rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-primary" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold">{userProfile.name}</h1>
            <p className="text-primary-foreground/80">{userProfile.email}</p>
            <p className="text-sm text-primary-foreground/60">Membre depuis {userProfile.joinDate}</p>
          </div>
          <Button variant="ghost" size="sm">
            <Edit className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-secondary border-b border-border">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex flex-col items-center py-3 px-2 transition-colors ${
                activeTab === tab.id
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="w-4 h-4 mb-1" />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="p-4">
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Trophy className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">{userProfile.completedCourses}</div>
                  <div className="text-sm text-muted-foreground">Cours terminés</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <BookOpen className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">{userProfile.totalCourses}</div>
                  <div className="text-sm text-muted-foreground">Cours au total</div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Activité récente</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Leçon terminée</p>
                    <p className="text-xs text-muted-foreground">Formation Coran - Il y a 2 heures</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <ShoppingBag className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Nouvelle formation achetée</p>
                    <p className="text-xs text-muted-foreground">Langue Arabe - Il y a 1 jour</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="space-y-4">
            {myCourses.map((course) => (
              <Card key={course.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-foreground">{course.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      course.status === 'Terminé' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {course.status}
                    </span>
                  </div>
                  <div className="mb-3">
                    <div className="flex justify-between text-sm text-muted-foreground mb-1">
                      <span>Progression</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">Acheté le {course.purchaseDate}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-foreground">{order.course}</h3>
                      <p className="text-sm text-muted-foreground">#{order.id}</p>
                    </div>
                    <span className="text-lg font-bold text-primary">{order.amount}€</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-muted-foreground">{order.date}</p>
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                      {order.status}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'wallet' && (
          <div className="space-y-4">
            <Card>
              <CardContent className="p-6 text-center">
                <Wallet className="w-12 h-12 text-primary mx-auto mb-4" />
                <div className="text-3xl font-bold text-foreground mb-2">{userProfile.walletBalance}€</div>
                <div className="text-muted-foreground mb-4">Solde disponible</div>
                <Button className="w-full">Recharger le portefeuille</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Historique des transactions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">Achat formation</p>
                    <p className="text-xs text-muted-foreground">1 mars 2024</p>
                  </div>
                  <span className="text-red-600 font-medium">-49.99€</span>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">Rechargement</p>
                    <p className="text-xs text-muted-foreground">25 février 2024</p>
                  </div>
                  <span className="text-green-600 font-medium">+100.00€</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
