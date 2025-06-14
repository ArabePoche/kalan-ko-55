
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

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

const AvailableTeachers = ({ teachers }: AvailableTeachersProps) => (
  <div className="bg-[#202c33] border-t border-[#313d44] p-4">
    <h4 className="text-sm font-medium mb-3 text-white">Professeurs disponibles</h4>
    <div className="flex space-x-3 overflow-x-auto">
      {teachers.map((teacher) => (
        <div key={teacher.id} className="flex-shrink-0 text-center">
          <div className="relative mb-2">
            <Avatar className="w-12 h-12">
              <AvatarImage src={teacher.avatar} />
              <AvatarFallback className="bg-[#8696a0] text-white">
                {teacher.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-[#202c33] ${
              teacher.status === 'en ligne' ? 'bg-[#25d366]' : 'bg-[#8696a0]'
            }`} />
          </div>
          <p className="text-xs text-[#8696a0] max-w-16 truncate">{teacher.name}</p>
        </div>
      ))}
    </div>
  </div>
);

export default AvailableTeachers;
