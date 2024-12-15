import React from 'react';
import { Button, Input, Card, Badge } from '../components/ui';
import { Layout, HeaderTitle, HeaderActions } from '../components/Layout';
import ImageGenerator from '../components/ImageGenerator';

export const ExamplePage = () => {
  return (
    <Layout
      header={
        <>
          <HeaderTitle>YOGI UI Components</HeaderTitle>
          <HeaderActions>
            <Button variant="primary" size="sm">Action</Button>
            <Button variant="secondary" size="sm">Another Action</Button>
          </HeaderActions>
        </>
      }
    >
      <div className="p-6 space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">Image Generation</h2>
          <ImageGenerator onImageGenerated={url => console.log('Generated image:', url)} />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Basic Components</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <div className="p-4">
                <h3 className="text-lg font-medium mb-4">Buttons</h3>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Button variant="primary">Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="primary" size="sm">Small</Button>
                    <Button variant="primary" size="md">Medium</Button>
                    <Button variant="primary" size="lg">Large</Button>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="primary" isLoading>Loading</Button>
                    <Button variant="primary" disabled>Disabled</Button>
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-4">
                <h3 className="text-lg font-medium mb-4">Inputs</h3>
                <div className="space-y-4">
                  <Input
                    label="Basic Input"
                    placeholder="Enter some text..."
                  />
                  <Input
                    label="With Icon"
                    placeholder="Search..."
                    icon={
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    }
                  />
                  <Input
                    label="With Error"
                    placeholder="Enter email..."
                    error="Invalid email address"
                  />
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-4">
                <h3 className="text-lg font-medium mb-4">Badges</h3>
                <div className="flex gap-2 flex-wrap">
                  <Badge>Default</Badge>
                  <Badge variant="success">Success</Badge>
                  <Badge variant="warning">Warning</Badge>
                  <Badge variant="error">Error</Badge>
                  <Badge variant="primary">Primary</Badge>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </div>
    </Layout>
  );
};
