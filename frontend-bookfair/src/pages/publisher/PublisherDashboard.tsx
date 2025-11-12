import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/common/Button";
import { Card } from "../../components/Card";
import LiteraryGenresCard from "../../components/LiteraryGenresCard/LiteraryGenresCard";

const PublisherDashboard: React.FC = () => {
  const dummyUser = {
    name: "Silva",
    email: "silva@example.com",
    companyName: "Sunrise Publications",
    role: "publisher",
    memberSince: "January 2025",
  };

  return (
    <div className="space-y-8 font-[Calibri] px-6 md:px-12">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          Welcome, {dummyUser.name}
        </h1>
        <p className="text-lg text-muted-foreground">{dummyUser.companyName}</p>
      </div>

      {/* KPI Cards (min column width 300px) */}
      <div className="grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]">
        <Card className="min-w-[300px] p-6 space-y-4 bg-white shadow-md rounded-lg">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase">
            Active Reservations
          </h3>
          <p className="text-3xl font-bold text-primary">2</p>
          <p className="text-sm text-muted-foreground">
            Currently active stall bookings
          </p>
        </Card>

        <Card className="min-w-[300px] p-6 space-y-4 bg-white shadow-md rounded-lg">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase">
            Pending Approvals
          </h3>
          <p className="text-3xl font-bold text-accent">1</p>
          <p className="text-sm text-muted-foreground">
            Awaiting organizer review
          </p>
        </Card>

        <Card className="min-w-[300px] p-6 space-y-4 bg-white shadow-md rounded-lg">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase">
            Literary genres
          </h3>

          <LiteraryGenresCard />
        </Card>
      </div>

    
      <div className="grid gap-8 [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]">

        <div className="space-y-6">
          <Card className="min-w-[300px] p-6 space-y-4 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold text-foreground">Reserve a Stall</h2>
            <p className="text-muted-foreground">
              Browse available stalls at the Colombo International Book Fair and
              make your reservation.
            </p>
            <Link to="/publisher/reserve-stall">
              <Button className="w-full">Browse Available Stalls</Button>
            </Link>
          </Card>

          <Card className="min-w-[300px] p-6 space-y-4 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold text-foreground">Your Reservations</h2>
            <p className="text-muted-foreground">
              View and manage all your stall reservations and bookings.
            </p>
            <Link to="/publisher/reservations">
              <Button className="w-full border border-primary text-primary hover:bg-primary hover:text-white">
                View Reservations
              </Button>
            </Link>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="min-w-[300px] p-6 space-y-4 bg-white shadow-md rounded-lg">
            <h3 className="text-lg font-semibold text-foreground">Quick Info</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground">Email</p>
                <p className="font-medium text-foreground">{dummyUser.email}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Account Type</p>
                <p className="font-medium text-foreground capitalize">
                  {dummyUser.role}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Member Since</p>
                <p className="font-medium text-foreground">
                  {dummyUser.memberSince}
                </p>
              </div>
            </div>
          </Card>

          <Card className="min-w-[300px] p-6 space-y-4 bg-white shadow-md rounded-lg mb-10">
            <h3 className="text-lg font-semibold text-foreground">Need Help?</h3>
            <p className="text-sm text-muted-foreground">
              Check our FAQ or contact support for assistance with your
              reservation.
            </p>
            <Button className="w-full text-sm bg-transparent border border-primary text-primary hover:bg-primary hover:text-white">
              Contact Support
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PublisherDashboard;
