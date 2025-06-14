
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown, Users } from "lucide-react";
import { useState } from "react";

interface Teacher {
  id: string;
  name: string;
  status: string;
  subject: string;
  avatar: string;
}
interface AvailableTeachersProps {
  teachers: Teacher[];
}

const AvailableTeachers = ({ teachers }: AvailableTeachersProps) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="bg-[#202c33] border-t border-[#313d44]">
      <Button
        onClick={() => setIsVisible(!isVisible)}
        variant="ghost"
        className="w-full p-4 text-left justify-between text-white hover:bg-[#2a3942]"
      >
        <div className="flex items-center space-x-3">
          <Users className="w-5 h-5 text-[#25d366]" />
          <div>
            <p className="font-medium">Professeurs disponibles</p>
            <p className="text-sm text-[#8696a0]">
              {teachers.filter(t => t.status === 'en ligne').length} en ligne
            </p>
          </div>
        </div>
        {isVisible ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </Button>
      
      {isVisible && (
        <div className="p-4 bg-[#0b141a] border-t border-[#313d44]">
          <div className="flex space-x-3 overflow-x-auto pb-2">
            {teachers.map((teacher) => (
              <div key={teacher.id} className="flex-shrink-0 text-center min-w-[4rem]">
                <div className="relative mb-2">
                  <Avatar className="w-12 h-12 mx-auto">
                    <AvatarImage src={teacher.avatar} />
                    <AvatarFallback className="bg-[#8696a0] text-white">
                      {teacher.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-[#202c33] ${
                    teacher.status === 'en ligne' ? 'bg-[#25d366]' : 'bg-[#8696a0]'
                  }`} />
                </div>
                <p className="text-xs text-[#8696a0] max-w-16 truncate mx-auto">{teacher.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AvailableTeachers;
