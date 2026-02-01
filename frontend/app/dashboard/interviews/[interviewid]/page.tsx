import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const Page = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardContent className="p-6 flex flex-col gap-6">

          {/* Header */}
          <div className="text-center">
            <h1 className="text-2xl font-semibold">AI Interview</h1>
            <p className="text-sm text-muted-foreground">
              Voice-based technical interview
            </p>
          </div>

          {/* Question */}
          <div className="rounded-lg bg-muted p-4">
            <p className="text-xs text-muted-foreground mb-1">
              Question 1
            </p>
            <p className="text-base font-medium">
              Explain event delegation in JavaScript.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3">
            <Button variant="secondary" className="w-full">
              🎙 Talk
            </Button>
            <Button className="w-full">
              Next Question →
            </Button>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-muted-foreground">
            Powered by AI Interview Engine
          </p>

        </CardContent>
      </Card>
    </div>
  )
}

export default Page