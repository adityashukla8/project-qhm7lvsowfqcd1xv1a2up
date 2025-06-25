import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCopilotChat } from "@copilotkit/react-core";

export function ChatButton() {
  const { toggleSidebar } = useCopilotChat();

  return (
    <Button
      onClick={toggleSidebar}
      className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-300"
      size="icon"
    >
      <MessageCircle className="w-6 h-6" />
    </Button>
  );
}