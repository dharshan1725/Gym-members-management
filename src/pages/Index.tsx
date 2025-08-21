import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Dashboard from "@/components/dashboard/Dashboard";
import MemberManagement from "@/components/members/MemberManagement";
import PaymentManagement from "@/components/payments/PaymentManagement";
import { supabase } from "@/lib/supabase";


const Index = () => {
  const [currentView, setCurrentView] = useState("dashboard");
  const [connected, setConnected] = useState(false);
  const [members, setMembers] = useState<any[]>([]);

  useEffect(() => {
    const checkConnection = async () => {
      try {
       
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        setConnected(true);

        // Fetch first 5 members from your table
        const { data, error: memberError } = await supabase
          .from("members")
          .select("*")
          .limit(5);

        if (memberError) throw memberError;
        console.log("Fetched members:", data);
        setMembers(data || []);
      } catch (err) {
        console.error("Supabase check failed:", err);
        setConnected(false);
      }
    };

    checkConnection();
  }, []);

  return (
    <div>
      <Navbar currentView={currentView} onViewChange={setCurrentView} />

      <div className="bg-gray-100 p-2 text-sm">
        {connected ? "✅ Connected to Supabase" : "❌ Not Connected"}
      </div>

      {/* Show members preview */}
      <div className="p-4">
        <h2 className="text-lg font-bold">Sample Members</h2>
        {members.length > 0 ? (
          <ul className="list-disc pl-5">
            {members.map((m) => (
              <li key={m.id}>{m.name} ({m.email})</li>
            ))}
          </ul>
        ) : (
          <p>No members found</p>
        )}
      </div>

      <main className="p-6">
        {currentView === "dashboard" && <Dashboard />}
        {currentView === "members" && <MemberManagement />}
        {currentView === "payments" && <PaymentManagement />}
      </main>
    </div>
  );
};

export default Index;
