
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Shield, Trash2 } from "lucide-react";

interface RoleManagementProps {
  serverId: string;
}

const RoleManagement = ({ serverId }: RoleManagementProps) => {
  const [activeTab, setActiveTab] = useState("members");

  // Fetch server members
  const { data: members = [], isLoading: loadingMembers } = useQuery({
    queryKey: ["serverMembers", serverId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("server_members")
        .select(`*, profiles:user_id(username, avatar_url)`)
        .eq("server_id", serverId);

      if (error) throw error;
      return data || [];
    },
  });

  const roles = ["owner", "admin", "moderator", "member"];

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold">Role Management</h2>
        <p className="text-trioguard-dark/70 text-sm">
          Manage member roles and permissions
        </p>
      </div>

      <Tabs defaultValue="members" className="p-6">
        <TabsList>
          <TabsTrigger value="members" onClick={() => setActiveTab("members")}>
            <User className="mr-2 h-4 w-4" />
            Members
          </TabsTrigger>
          <TabsTrigger value="roles" onClick={() => setActiveTab("roles")}>
            <Shield className="mr-2 h-4 w-4" />
            Roles
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="members" className="pt-4">
          {loadingMembers ? (
            <div className="text-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-trioguard border-t-transparent rounded-full mx-auto mb-4"></div>
              <p>Loading members...</p>
            </div>
          ) : members.length > 0 ? (
            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50 text-sm">
                    <th className="p-3 text-left font-medium">Member</th>
                    <th className="p-3 text-left font-medium">Role</th>
                    <th className="p-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((member: any) => (
                    <tr key={member.id} className="border-b">
                      <td className="p-3 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                          {member.profiles?.avatar_url ? (
                            <img 
                              src={member.profiles.avatar_url} 
                              alt={member.profiles.username || "User"} 
                              className="w-full h-full object-cover" 
                            />
                          ) : (
                            <User className="text-gray-500" size={16} />
                          )}
                        </div>
                        <span>{member.profiles?.username || "Unknown User"}</span>
                      </td>
                      <td className="p-3">
                        <Badge variant={member.role === "owner" ? "destructive" : member.role === "admin" ? "default" : "outline"}>
                          {member.role}
                        </Badge>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button className="text-gray-500 hover:text-gray-700">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No members found for this server.
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="roles" className="pt-4">
          <div className="space-y-4">
            {roles.map(role => (
              <div key={role} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-medium capitalize">{role}</h3>
                    <p className="text-sm text-gray-500">
                      {role === "owner" && "Full access and ownership of the server"}
                      {role === "admin" && "Can manage most server settings and members"}
                      {role === "moderator" && "Can moderate user content and manage basic settings"}
                      {role === "member" && "Basic access to server features"}
                    </p>
                  </div>
                  <Badge variant={role === "owner" ? "destructive" : role === "admin" ? "default" : "outline"}>
                    {role}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RoleManagement;
