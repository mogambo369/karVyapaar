import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Upload, Download, Plus, Trash2, AlertTriangle, FileText, Calendar } from "lucide-react";
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface BannedMedicine {
  id: string;
  name: string;
  category: string;
  bannedDate: string;
  reason: string;
  authority: string;
  notificationNo: string;
}

const initialBannedMedicines: BannedMedicine[] = [
  { id: "BM001", name: "Nimesulide (Pediatric)", category: "Analgesic", bannedDate: "2011-02-10", reason: "Hepatotoxicity in children", authority: "CDSCO", notificationNo: "GSR 82(E)" },
  { id: "BM002", name: "Cisapride", category: "Prokinetic", bannedDate: "2011-03-10", reason: "Cardiac arrhythmias", authority: "CDSCO", notificationNo: "GSR 160(E)" },
  { id: "BM003", name: "Phenylpropanolamine", category: "Decongestant", bannedDate: "2011-02-10", reason: "Hemorrhagic stroke risk", authority: "CDSCO", notificationNo: "GSR 82(E)" },
  { id: "BM004", name: "Sibutramine", category: "Anti-obesity", bannedDate: "2010-10-14", reason: "Cardiovascular risks", authority: "CDSCO", notificationNo: "GSR 767(E)" },
  { id: "BM005", name: "Rosiglitazone", category: "Antidiabetic", bannedDate: "2010-09-22", reason: "Increased cardiac events", authority: "CDSCO", notificationNo: "GSR 743(E)" },
  { id: "BM006", name: "Tegaserod", category: "GI Agent", bannedDate: "2007-03-30", reason: "Cardiovascular ischemic events", authority: "CDSCO", notificationNo: "GSR 211(E)" },
  { id: "BM007", name: "Gatifloxacin (Oral)", category: "Antibiotic", bannedDate: "2011-03-10", reason: "Dysglycemia", authority: "CDSCO", notificationNo: "GSR 160(E)" },
  { id: "BM008", name: "Letrozole (Infertility)", category: "Hormonal", bannedDate: "2011-10-03", reason: "Not approved for infertility", authority: "CDSCO", notificationNo: "GSR 730(E)" },
];

export const BannedMedicines = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [bannedMedicines, setBannedMedicines] = useState<BannedMedicine[]>(initialBannedMedicines);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newMedicine, setNewMedicine] = useState<Partial<BannedMedicine>>({});
  const { toast } = useToast();

  const filteredMedicines = bannedMedicines.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.notificationNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddMedicine = () => {
    if (!newMedicine.name || !newMedicine.category) {
      toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" });
      return;
    }
    const medicine: BannedMedicine = {
      id: `BM${String(bannedMedicines.length + 1).padStart(3, "0")}`,
      name: newMedicine.name || "",
      category: newMedicine.category || "",
      bannedDate: newMedicine.bannedDate || new Date().toISOString().split("T")[0],
      reason: newMedicine.reason || "",
      authority: newMedicine.authority || "CDSCO",
      notificationNo: newMedicine.notificationNo || "",
    };
    setBannedMedicines([...bannedMedicines, medicine]);
    setNewMedicine({});
    setIsAddDialogOpen(false);
    toast({ title: "Success", description: "Banned medicine added to database" });
  };

  const handleDelete = (id: string) => {
    setBannedMedicines(bannedMedicines.filter((m) => m.id !== id));
    toast({ title: "Removed", description: "Medicine removed from banned list" });
  };

  const handleCSVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      toast({ title: "Processing", description: "Uploading banned medicines list..." });
      // Simulate CSV processing
      setTimeout(() => {
        toast({ title: "Success", description: "CSV file processed successfully" });
      }, 1500);
    }
  };

  const downloadTemplate = () => {
    const csvContent = "name,category,bannedDate,reason,authority,notificationNo\nExample Drug,Category,2024-01-01,Reason for ban,CDSCO,GSR XXX(E)";
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "banned-medicines-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Warning Banner */}
      <Card className="border-destructive/30 bg-destructive/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
            <div>
              <h3 className="font-semibold text-destructive">Important Compliance Notice</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Medicines listed here are banned by CDSCO/State Drug Authorities. Selling these items is a punishable offense. 
                The billing system will automatically block any attempt to sell these medicines.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="relative w-full lg:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, category, notification..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={downloadTemplate} className="gap-2">
            <Download className="h-4 w-4" />
            Download Template
          </Button>
          <label>
            <Button variant="outline" className="gap-2 cursor-pointer" asChild>
              <span>
                <Upload className="h-4 w-4" />
                Upload CSV
              </span>
            </Button>
            <input type="file" accept=".csv" onChange={handleCSVUpload} className="hidden" />
          </label>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Medicine
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Banned Medicine</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Medicine Name *</Label>
                  <Input
                    placeholder="Enter medicine name"
                    value={newMedicine.name || ""}
                    onChange={(e) => setNewMedicine({ ...newMedicine, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select onValueChange={(v) => setNewMedicine({ ...newMedicine, category: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border border-border">
                      <SelectItem value="Analgesic">Analgesic</SelectItem>
                      <SelectItem value="Antibiotic">Antibiotic</SelectItem>
                      <SelectItem value="Antidiabetic">Antidiabetic</SelectItem>
                      <SelectItem value="Hormonal">Hormonal</SelectItem>
                      <SelectItem value="GI Agent">GI Agent</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Ban Date</Label>
                  <Input
                    type="date"
                    value={newMedicine.bannedDate || ""}
                    onChange={(e) => setNewMedicine({ ...newMedicine, bannedDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Reason for Ban</Label>
                  <Input
                    placeholder="Enter reason"
                    value={newMedicine.reason || ""}
                    onChange={(e) => setNewMedicine({ ...newMedicine, reason: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Notification Number</Label>
                  <Input
                    placeholder="e.g., GSR 82(E)"
                    value={newMedicine.notificationNo || ""}
                    onChange={(e) => setNewMedicine({ ...newMedicine, notificationNo: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddMedicine}>Add to Database</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border-border">
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-muted-foreground">Total Banned</p>
            <p className="text-xl font-bold text-foreground">{bannedMedicines.length}</p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-muted-foreground">CDSCO Bans</p>
            <p className="text-xl font-bold text-foreground">{bannedMedicines.filter(m => m.authority === "CDSCO").length}</p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-muted-foreground">Categories</p>
            <p className="text-xl font-bold text-foreground">{new Set(bannedMedicines.map(m => m.category)).size}</p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-muted-foreground">Last Updated</p>
            <p className="text-xl font-bold text-foreground">Today</p>
          </CardContent>
        </Card>
      </div>

      {/* Banned Medicines Table */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Banned Medicines Database
          </CardTitle>
          <CardDescription>Complete list of medicines prohibited for sale</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Medicine Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Ban Date</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Notification</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMedicines.map((medicine) => (
                  <TableRow key={medicine.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant="destructive" className="h-2 w-2 p-0 rounded-full" />
                        <span className="font-medium">{medicine.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{medicine.category}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {medicine.bannedDate}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground">
                      {medicine.reason}
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-muted px-2 py-1 rounded">{medicine.notificationNo}</code>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(medicine.id)}>
                        <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
