
import { FileText, Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'doc' | 'video' | 'audio';
  size: string;
  downloadUrl?: string;
}

interface FormationResourcesSectionProps {
  formationId: string;
}

const FormationResourcesSection = ({ formationId }: FormationResourcesSectionProps) => {
  // Données factices pour la démonstration
  const resources: Resource[] = [
    {
      id: '1',
      title: 'Guide de lecture du Coran.pdf',
      type: 'pdf',
      size: '2.3 MB',
      downloadUrl: '#'
    },
    {
      id: '2',
      title: 'Exercices pratiques.doc',
      type: 'doc',
      size: '1.1 MB',
      downloadUrl: '#'
    },
    {
      id: '3',
      title: 'Récitation modèle.mp3',
      type: 'audio',
      size: '5.7 MB',
      downloadUrl: '#'
    }
  ];

  const getFileIcon = (type: Resource['type']) => {
    switch (type) {
      case 'pdf':
        return '📄';
      case 'doc':
        return '📝';
      case 'video':
        return '🎥';
      case 'audio':
        return '🎵';
      default:
        return '📁';
    }
  };

  return (
    <div className="h-full bg-[#0b141a] text-white p-4 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Ressources de la formation</h2>
          <p className="text-[#8696a0]">Téléchargez et consultez les documents complémentaires</p>
        </div>

        <div className="space-y-4">
          {resources.map((resource) => (
            <Card key={resource.id} className="bg-[#202c33] border-[#313d44]">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{getFileIcon(resource.type)}</div>
                    <div>
                      <h3 className="font-medium text-white">{resource.title}</h3>
                      <p className="text-sm text-[#8696a0]">{resource.size}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-[#313d44] text-[#8696a0] hover:text-white hover:bg-[#2a3942]"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Voir
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-[#313d44] text-[#8696a0] hover:text-white hover:bg-[#2a3942]"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Télécharger
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {resources.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-[#8696a0] mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Aucune ressource disponible</h3>
            <p className="text-[#8696a0]">Les ressources seront ajoutées prochainement</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormationResourcesSection;
