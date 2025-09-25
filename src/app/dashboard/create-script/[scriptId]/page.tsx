"use client";
import { ArrowLeft, ArrowRight } from "lucide-react";
import z from "zod";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQueryState } from "@/hooks/use-query-state";

type ConfigurationStep = "goal" | "persona" | "rules" | "resources";
type ConfigurationTab = {
  key: ConfigurationStep;
  displayText: Capitalize<ConfigurationStep>;
};

const configTabs = [
  {
    key: "goal",
    displayText: "Goal",
  },
  {
    key: "persona",
    displayText: "Persona",
  },
  {
    key: "rules",
    displayText: "Rules",
  },
  {
    key: "resources",
    displayText: "Resources",
  },
] satisfies ConfigurationTab[];

export default function ScriptConfigurationPage() {
  const defaultStep = configTabs[0].key;
  const [step, setStep] = useQueryState("step", {
    defaultValue: defaultStep,
    schema: z.literal(configTabs.map((tab) => tab.key)),
  });

  return (
    <main className="flex h-screen flex-col items-center pt-16">
      <div>
        <div className="mb-12 flex w-full items-center justify-between">
          <Button
            size="xs"
            variant="outline"
            onClick={() => {
              const currentIndex = configTabs.findIndex(
                (tab) => tab.key === step,
              );

              if (currentIndex < -1 || currentIndex === 0) {
                return;
              }

              setStep(configTabs[currentIndex - 1].key);
            }}
          >
            <ArrowLeft /> Back
          </Button>
          <h1 className="font-semibold text-lg text-stone-900">
            Configure Script
          </h1>
          <Button
            size="xs"
            onClick={() => {
              const currentIndex = configTabs.findIndex(
                (tab) => tab.key === step,
              );

              if (currentIndex < -1 || currentIndex === configTabs.length - 1) {
                return;
              }

              setStep(configTabs[currentIndex + 1].key);
            }}
          >
            Next <ArrowRight />
          </Button>
        </div>
        <div className="flex h-96 w-3xl">
          <Tabs
            value={step ?? defaultStep}
            orientation="vertical"
            className="w-full flex-row"
            activationMode="manual" // BUG: if not specified, onValueChange triggers twice
            onValueChange={(value) => {
              if (value !== step) {
                setStep(value);
              }
            }}
          >
            <TabsList className="flex h-fit w-32 flex-col bg-transparent p-0">
              {configTabs.map((tab) => (
                <TabsTrigger
                  key={tab.key}
                  variant="ghost"
                  className="justify-start"
                  value={tab.key}
                >
                  {tab.displayText}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value="goal">
              <Panel>
                <PanelHeader>
                  <PanelTitle>Primary Goal</PanelTitle>
                  <PanelDescription>
                    Why does this script exist? What does success look like?
                  </PanelDescription>
                </PanelHeader>

                <PanelContent>
                  <PanelInput placeholder="Discover features for my app" />
                </PanelContent>
              </Panel>
            </TabsContent>
            <TabsContent value="persona">
              <Panel>
                <PanelHeader>
                  <PanelTitle>Agent Persona</PanelTitle>
                  <PanelDescription>
                    How should the agent speak and behave? You can define tone,
                    style, and example phrases.
                  </PanelDescription>
                </PanelHeader>

                <PanelContent>
                  <PanelInput
                    placeholder={`Friendly, conversational, avoids jargon.\nExample: “Thanks, that helps a lot!”`}
                  />
                </PanelContent>
              </Panel>
            </TabsContent>
            <TabsContent value="rules">
              <Panel>
                <PanelHeader>
                  <PanelTitle>Conversation Rules</PanelTitle>
                  <PanelDescription>
                    What guidelines should the agent always follow? Think
                    boundaries, do’s and don’ts, or constraints that ensure
                    quality and compliance.
                  </PanelDescription>
                </PanelHeader>

                <PanelContent>
                  <PanelInput
                    placeholder={`- Never ask for personal financial details\n -Always thank the user for their time`}
                  />
                </PanelContent>
              </Panel>
            </TabsContent>
            <TabsContent value="resources">
              <Panel>
                <PanelHeader>
                  <PanelTitle>Resources & Knowledge</PanelTitle>
                  <PanelDescription>
                    What sources of information does the agent have access to?
                    Add links, documents, APIs, or notes that provide context
                    during the conversation.
                  </PanelDescription>
                </PanelHeader>

                <PanelContent>
                  <PanelInput placeholder="Product docs, Support API, Internal knowledge base" />
                </PanelContent>
              </Panel>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
}

// -------- Display Components
function Panel({ children }: { children: React.ReactNode }) {
  return <div className="flex size-full flex-col gap-5 pl-6">{children}</div>;
}

function PanelHeader({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

function PanelTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="font-medium text-stone-900">{children}</h2>;
}

function PanelDescription({ children }: { children: React.ReactNode }) {
  return <p className="text-stone-600/80">{children}</p>;
}

function PanelContent({ children }: { children: React.ReactNode }) {
  return <div className="flex-1">{children}</div>;
}

function PanelInput(props: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className="size-full resize-none rounded bg-stone-50 px-3 py-2 text-stone-900 shadow-xs ring-1 ring-stone-900/10 placeholder:text-stone-400"
      {...props}
    />
  );
}
// --------
