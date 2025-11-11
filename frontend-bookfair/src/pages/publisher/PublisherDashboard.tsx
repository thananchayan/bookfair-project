import React from "react"
import { useAuth } from "../../lib/auth-context.tsx"
import { Button } from "../../components/common/Button"
import { Card } from "../../components/Card.tsx"

import { Link } from "react-router-dom"

const PublisherDashboard: React.FC = () => {
  const { user } = useAuth()

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-foreground">
          Welcome, {user?.name || "Publisher"}
        </h1>
        <p className="text-lg text-muted-foreground">{user?.companyName || "Your Company"}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase">
            Active Reservations
          </h3>
          <p className="text-3xl font-bold text-primary">0</p>
          <p className="text-sm text-muted-foreground">No active stall reservations</p>
        </Card>

        <Card className="p-6 space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase">
            Pending Approvals
          </h3>
          <p className="text-3xl font-bold text-accent">0</p>
          <p className="text-sm text-muted-foreground">Awaiting organizer review</p>
        </Card>

        <Card className="p-6 space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase">
            Completed Events
          </h3>
          <p className="text-3xl font-bold text-foreground">0</p>
          <p className="text-sm text-muted-foreground">Past book fair participations</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Reserve a Stall</h2>
            <p className="text-muted-foreground">
              Browse available stalls at the Colombo International Bookfair and make your reservation.
            </p>
            <Link to="/publisher/reserve-stall">
              <Button className="w-full">Browse Available Stalls</Button>
            </Link>
          </Card>

          <Card className="p-6 space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Your Reservations</h2>
            <p className="text-muted-foreground">
              View and manage all your stall reservations and bookings.
            </p>
            <Link to="/publisher/reservations">
              <Button variant="secondary" className="w-full bg-transparent">
                View Reservations
              </Button>
            </Link>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6 space-y-4 bg-secondary/50">
            <h3 className="text-lg font-semibold text-foreground">Quick Info</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground">Email</p>
                <p className="font-medium text-foreground">{user?.email || "example@email.com"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Account Type</p>
                <p className="font-medium text-foreground capitalize">{user?.role || "publisher"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Member Since</p>
                <p className="font-medium text-foreground">Today</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 space-y-4 border-primary/20 bg-primary/5">
            <h3 className="text-lg font-semibold text-foreground">Need Help?</h3>
            <p className="text-sm text-muted-foreground">
              Check our FAQ or contact support for assistance with your reservation.
            </p>
            <Button variant="secondary" className="w-full text-sm bg-transparent">
              Contact Support
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default PublisherDashboard
