import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, AlertTriangle, Info, CheckCircle, ExternalLink, Calendar, Building, FileText, Settings } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface Alert {
  id: string;
  title: string;
  description: string;
  type: "critical" | "warning" | "info" | "update";
  source: string;
  date: string;
  isRead: boolean;
  link?: string;
}

const initialAlerts: Alert[] = [
  {
    id: "A001",
    title: "New Banned Drug List Updated",
    description: "CDSCO has added 5 new Fixed Dose Combinations (FDCs) to the banned list effective from January 15, 2024. Please update your inventory accordingly.",
    type: "critical",
    source: "Central Drugs Standard Control Organisation",
    date: "2024-01-20",
    isRead: false,
    link: "https://cdsco.gov.in"
  },
  {
    id: "A002",
    title: "GST Rate Revision on Essential Medicines",
    description: "GST Council has revised tax rates for 14 categories of essential medicines. New rates applicable from April 1, 2024.",
    type: "warning",
    source: "GST Council",
    date: "2024-01-18",
    isRead: false,
    link: "https://gst.gov.in"
  },
  {
    id: "A003",
    title: "Drug License Renewal Reminder",
    description: "Your pharmacy drug license (DL-20B) is due for renewal in 45 days. Please initiate the renewal process to avoid disruption.",
    type: "warning",
    source: "State Drug Control Department",
    date: "2024-01-15",
    isRead: true
  },
  {
    id: "A004",
    title: "New e-Invoice Mandate",
    description: "All pharmaceutical retailers with turnover above ₹5 crores must implement e-invoicing by March 1, 2024.",
    type: "info",
    source: "Ministry of Finance",
    date: "2024-01-12",
    isRead: true,
    link: "https://einvoice.gst.gov.in"
  },
  {
    id: "A005",
    title: "Scheduled Drugs Compliance Update",
    description: "New guidelines for Schedule H and H1 drug sales record maintenance have been issued. Digital records are now mandatory.",
    type: "update",
    source: "CDSCO",
    date: "2024-01-10",
    isRead: true,
    link: "https://cdsco.gov.in"
  },
];

interface NotificationSettings {
  bannedMedicines: boolean;
  expiryAlerts: boolean;
  licenseReminders: boolean;
  gstUpdates: boolean;
  regulatoryChanges: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
}

const getAlertIcon = (type: string) => {
  switch (type) {
    case "critical":
      return <AlertTriangle className="h-5 w-5 text-destructive" />;
    case "warning":
      return <Bell className="h-5 w-5 text-chart-4" />;
    case "info":
      return <Info className="h-5 w-5 text-chart-1" />;
    case "update":
      return <CheckCircle className="h-5 w-5 text-chart-2" />;
    default:
      return <Bell className="h-5 w-5" />;
  }
};

const getAlertBadge = (type: string) => {
  switch (type) {
    case "critical":
      return <Badge className="bg-destructive/10 text-destructive border-0">Critical</Badge>;
    case "warning":
      return <Badge className="bg-chart-4/10 text-chart-4 border-0">Warning</Badge>;
    case "info":
      return <Badge className="bg-chart-1/10 text-chart-1 border-0">Info</Badge>;
    case "update":
      return <Badge className="bg-chart-2/10 text-chart-2 border-0">Update</Badge>;
    default:
      return <Badge variant="secondary">{type}</Badge>;
  }
};

export const RegulatoryAlerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [settings, setSettings] = useState<NotificationSettings>({
    bannedMedicines: true,
    expiryAlerts: true,
    licenseReminders: true,
    gstUpdates: true,
    regulatoryChanges: true,
    emailNotifications: true,
    smsNotifications: false,
  });

  const markAsRead = (id: string) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, isRead: true } : a));
  };

  const markAllAsRead = () => {
    setAlerts(alerts.map(a => ({ ...a, isRead: true })));
  };

  const unreadCount = alerts.filter(a => !a.isRead).length;

  const updateSetting = (key: keyof NotificationSettings) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bell className="h-6 w-6 text-primary" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Regulatory Alerts</h2>
            <p className="text-sm text-muted-foreground">{unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}</p>
          </div>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={markAllAsRead}>
            Mark All as Read
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alerts List */}
        <div className="lg:col-span-2 space-y-4">
          {alerts.map((alert) => (
            <Card 
              key={alert.id} 
              className={`border-border transition-colors ${!alert.isRead ? 'bg-primary/5 border-primary/20' : ''}`}
              onClick={() => markAsRead(alert.id)}
            >
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-muted">
                    {getAlertIcon(alert.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-foreground">{alert.title}</h3>
                        {getAlertBadge(alert.type)}
                        {!alert.isRead && (
                          <span className="h-2 w-2 bg-primary rounded-full" />
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{alert.description}</p>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Building className="h-3 w-3" />
                        {alert.source}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {alert.date}
                      </div>
                      {alert.link && (
                        <a 
                          href={alert.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-primary hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="h-3 w-3" />
                          Read More
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Settings Panel */}
        <div className="space-y-4">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Notification Settings
              </CardTitle>
              <CardDescription>Configure which alerts you receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="banned" className="flex items-center gap-2 cursor-pointer">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    Banned Medicines
                  </Label>
                  <Switch 
                    id="banned" 
                    checked={settings.bannedMedicines}
                    onCheckedChange={() => updateSetting("bannedMedicines")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="expiry" className="flex items-center gap-2 cursor-pointer">
                    <Calendar className="h-4 w-4 text-chart-4" />
                    Expiry Alerts
                  </Label>
                  <Switch 
                    id="expiry" 
                    checked={settings.expiryAlerts}
                    onCheckedChange={() => updateSetting("expiryAlerts")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="license" className="flex items-center gap-2 cursor-pointer">
                    <FileText className="h-4 w-4 text-primary" />
                    License Reminders
                  </Label>
                  <Switch 
                    id="license" 
                    checked={settings.licenseReminders}
                    onCheckedChange={() => updateSetting("licenseReminders")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="gst" className="flex items-center gap-2 cursor-pointer">
                    <Building className="h-4 w-4 text-chart-2" />
                    GST Updates
                  </Label>
                  <Switch 
                    id="gst" 
                    checked={settings.gstUpdates}
                    onCheckedChange={() => updateSetting("gstUpdates")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="regulatory" className="flex items-center gap-2 cursor-pointer">
                    <Info className="h-4 w-4 text-chart-1" />
                    Regulatory Changes
                  </Label>
                  <Switch 
                    id="regulatory" 
                    checked={settings.regulatoryChanges}
                    onCheckedChange={() => updateSetting("regulatoryChanges")}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <p className="text-sm font-medium text-muted-foreground">Delivery Channels</p>
                <div className="flex items-center justify-between">
                  <Label htmlFor="email" className="cursor-pointer">Email Notifications</Label>
                  <Switch 
                    id="email" 
                    checked={settings.emailNotifications}
                    onCheckedChange={() => updateSetting("emailNotifications")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="sms" className="cursor-pointer">SMS Notifications</Label>
                  <Switch 
                    id="sms" 
                    checked={settings.smsNotifications}
                    onCheckedChange={() => updateSetting("smsNotifications")}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg">Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <a 
                href="https://cdsco.gov.in" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors text-sm"
              >
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
                CDSCO Official Portal
              </a>
              <a 
                href="https://gst.gov.in" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors text-sm"
              >
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
                GST Portal
              </a>
              <a 
                href="https://pharmaceuticals.gov.in" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors text-sm"
              >
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
                Dept of Pharmaceuticals
              </a>
              <a 
                href="https://dgft.gov.in" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors text-sm"
              >
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
                DGFT Portal
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
