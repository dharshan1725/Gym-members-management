import { useState, useEffect } from "react";
import { supabase, Member } from "@/lib/supabase";

export default function MemberManagement() {
  const [members, setMembers] = useState<Member[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    contact: "",
    address: "",
    membership_start_date: "",
    membership_end_date: "",
    plan_type: "Monthly",
    emergency_contact: "",
  });

  // Fetch members on load
  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    const { data, error } = await supabase.from("members").select("*");
    if (error) console.error(error);
    else setMembers(data || []);
  };

  const addMember = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("members").insert([formData]);
    if (error) {
      console.error(error);
    } else {
      alert("✅ Member added successfully!");
      fetchMembers(); // refresh list
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Add New Member</h2>
      <form onSubmit={addMember} className="space-y-2">
        <input type="text" placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="border p-2 w-full"
          required
        />
        <input type="number" placeholder="Age"
          value={formData.age}
          onChange={(e) => setFormData({ ...formData, age: e.target.value })}
          className="border p-2 w-full"
          required
        />
        <input type="text" placeholder="Contact"
          value={formData.contact}
          onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
          className="border p-2 w-full"
        />
        <input type="text" placeholder="Address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          className="border p-2 w-full"
        />
        <input type="date"
          value={formData.membership_start_date}
          onChange={(e) => setFormData({ ...formData, membership_start_date: e.target.value })}
          className="border p-2 w-full"
        />
        <input type="date"
          value={formData.membership_end_date}
          onChange={(e) => setFormData({ ...formData, membership_end_date: e.target.value })}
          className="border p-2 w-full"
        />
        <select
          value={formData.plan_type}
          onChange={(e) => setFormData({ ...formData, plan_type: e.target.value as "Monthly" | "Quarterly" | "Yearly" })}
          className="border p-2 w-full"
        >
          <option>Monthly</option>
          <option>Quarterly</option>
          <option>Yearly</option>
        </select>
        <input type="text" placeholder="Emergency Contact"
          value={formData.emergency_contact}
          onChange={(e) => setFormData({ ...formData, emergency_contact: e.target.value })}
          className="border p-2 w-full"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2">Add Member</button>
      </form>

      <h2 className="text-xl font-bold mt-6 mb-2">Members List</h2>
      <ul className="list-disc pl-6">
        {members.map((m) => (
          <li key={m.id}>{m.name} ({m.plan_type})</li>
        ))}
      </ul>
    </div>
  );
}
