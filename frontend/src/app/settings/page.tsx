"use client";

import React, { useState } from 'react';
import { Settings, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl space-y-8 mt-8">

      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-2">
          <Settings className="h-8 w-8 text-primary" />
          System Settings
        </h1>
        <p className="text-muted-foreground">
          Configure platform preferences, AI model selection, and backend connectivity.
        </p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8 bg-muted/50 p-1">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="models">AI Models</TabsTrigger>
          <TabsTrigger value="network">Network & API</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>General Preferences</CardTitle>
              <CardDescription>Customize your FraudShield UI experience.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <select id="theme" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <option value="dark">Dark (Cybersecurity Standard)</option>
                  <option value="light">Light</option>
                  <option value="system">System Default</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">System Language</Label>
                <select id="language" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <option value="en">English</option>
                  <option value="hi">Hindi (हिन्दी)</option>
                  <option value="te">Telugu (తెలుగు)</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="models">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>AI Model Configuration</CardTitle>
              <CardDescription>Select which models to use for different analysis tasks.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Text Analysis Engine</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                  <option>Llama-3 (Default, High Speed)</option>
                  <option>GPT-4o (High Accuracy, Slower)</option>
                  <option>Mistral-Nemo (Privacy focused)</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Vision Model (OCR & Scene Analysis)</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                  <option>FraudShield Vision V2</option>
                  <option>Claude 3.5 Sonnet Vision</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Confidence Threshold</Label>
                <Input type="number" defaultValue={75} min={0} max={100} />
                <p className="text-xs text-muted-foreground mt-1">Scores below this will require manual review.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="network">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Backend Connectivity</CardTitle>
              <CardDescription>Configure connection to the FastAPI backend and databases.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="backend_url">FastAPI Backend URL</Label>
                <Input id="backend_url" defaultValue="http://localhost:8000/api/v1" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="neo4j_url">Neo4j Database URL</Label>
                <Input id="neo4j_url" defaultValue="bolt://localhost:7687" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="api_key">Global API Key</Label>
                <Input id="api_key" type="password" defaultValue="************************" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end pt-4">
        <Button onClick={handleSave} disabled={isSaving} className="bg-primary text-primary-foreground w-full sm:w-auto">
          {isSaving ? "Saving..." : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
        </Button>
      </div>

    </div>
  );
}
