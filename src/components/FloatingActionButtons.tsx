
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { MessageCircle, Play, FileText, PenTool, Settings } from "lucide-react";

interface FloatingActionButtonsProps {
  activeSection: 'video' | 'chat' | 'resources' | 'exercises' | 'settings';
  onSectionChange: (section: 'video' | 'chat' | 'resources' | 'exercises' | 'settings') => void;
  unreadMessages?: number;
}

const FloatingActionButtons = ({ activeSection, onSectionChange, unreadMessages = 0 }: FloatingActionButtonsProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const buttons = [
    {
      id: 'video' as const,
      icon: Play,
      label: 'Vidéos',
      color: 'bg-blue-500 hover:bg-blue-600',
      position: 'translate-x-0 translate-y-0'
    },
    {
      id: 'chat' as const,
      icon: MessageCircle,
      label: 'Chat',
      color: 'bg-green-500 hover:bg-green-600',
      position: 'translate-x-0 -translate-y-16',
      badge: unreadMessages
    },
    {
      id: 'resources' as const,
      icon: FileText,
      label: 'Ressources',
      color: 'bg-purple-500 hover:bg-purple-600',
      position: 'translate-x-0 -translate-y-32'
    },
    {
      id: 'exercises' as const,
      icon: PenTool,
      label: 'Exercices',
      color: 'bg-orange-500 hover:bg-orange-600',
      position: 'translate-x-0 -translate-y-48'
    },
    {
      id: 'settings' as const,
      icon: Settings,
      label: 'Paramètres',
      color: 'bg-gray-500 hover:bg-gray-600',
      position: 'translate-x-0 -translate-y-64'
    }
  ];

  // Ne montrer que les boutons qui ne sont pas la section active
  const visibleButtons = buttons.filter(button => button.id !== activeSection);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="relative">
        {/* Boutons secondaires */}
        {isExpanded && visibleButtons.map((button, index) => {
          const Icon = button.icon;
          return (
            <div
              key={button.id}
              className={`absolute transition-all duration-300 ease-out ${button.position}`}
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <Button
                onClick={() => {
                  onSectionChange(button.id);
                  setIsExpanded(false);
                }}
                className={`${button.color} text-white shadow-lg rounded-full p-3 transition-all duration-300 hover:scale-110 relative group`}
                size="icon"
              >
                <Icon className="w-5 h-5" />
                {button.badge && button.badge > 0 && (
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
                    {button.badge > 9 ? '9+' : button.badge}
                  </div>
                )}
                <div className="absolute right-12 top-1/2 transform -translate-y-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  {button.label}
                </div>
              </Button>
            </div>
          );
        })}

        {/* Bouton principal */}
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`${
            isExpanded 
              ? 'bg-red-500 hover:bg-red-600 rotate-45' 
              : 'bg-primary hover:bg-primary/90'
          } text-white shadow-lg rounded-full p-4 transition-all duration-300 hover:scale-110`}
          size="icon"
        >
          {isExpanded ? (
            <div className="w-6 h-6 relative">
              <div className="absolute inset-0 w-full h-0.5 bg-white top-1/2 transform -translate-y-1/2"></div>
              <div className="absolute inset-0 h-full w-0.5 bg-white left-1/2 transform -translate-x-1/2"></div>
            </div>
          ) : (
            (() => {
              const activeButton = buttons.find(b => b.id === activeSection);
              const ActiveIcon = activeButton?.icon || Play;
              return <ActiveIcon className="w-6 h-6" />;
            })()
          )}
        </Button>
      </div>
    </div>
  );
};

export default FloatingActionButtons;
