import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CreateScriptPage() {
  return (
    <main className="flex h-screen flex-col items-center pt-16">
      <div>
        <div className="mb-12 flex w-full items-center justify-between">
          <Button size="xs" variant="outline">
            <ArrowLeft /> Back
          </Button>
          <h1 className="font-semibold text-lg text-stone-900">
            Configure Script
          </h1>
          <Button size="xs">
            Next <ArrowRight />
          </Button>
        </div>
        <div className="flex h-96 w-3xl">
          <Tabs
            defaultValue="goal"
            orientation="vertical"
            className="w-full flex-row"
          >
            <TabsList className="flex h-fit w-32 flex-col bg-transparent p-0">
              <TabsTrigger
                variant="ghost"
                className="justify-start"
                value="goal"
              >
                Goal
              </TabsTrigger>
              <TabsTrigger
                variant="ghost"
                className="justify-start"
                value="persona"
              >
                Persona
              </TabsTrigger>
              <TabsTrigger
                variant="ghost"
                className="justify-start"
                value="rules"
              >
                Rules
              </TabsTrigger>
              <TabsTrigger
                variant="ghost"
                className="justify-start"
                value="resources"
              >
                Resources
              </TabsTrigger>
            </TabsList>
            <TabsContent value="goal">
              <Panel>
                <PanelHeader>
                  <PanelTitle>1. Primary Goal</PanelTitle>
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
