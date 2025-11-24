import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/common/Button";
import { Card } from "../../components/Card";
import LiteraryGenresCard from "../../components/LiteraryGenresCard/LiteraryGenresCard";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchProfile } from "../../features/auth/authSlice";



const PublisherDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { username, role, profile } = useAppSelector((s) => s.auth);

  useEffect(() => {
    if (!profile) dispatch(fetchProfile());
  }, [dispatch, profile]);

  const displayUsername = username || "Publisher";

  return (
    <div className="space-y-8 font-[Calibri] px-6 md:px-12">
      {/* Header */}
      <div className="space-y-2">
        <h1>Welcome, {displayUsername}</h1>
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
            <h2 className="text-2xl font-bold text-foreground">Reserve Stalls</h2>
            <p className="text-muted-foreground">
              Browse available stalls at the Colombo International Book Fair and
              make your reservation.
            </p>
            <Link to="/publisher/upcoming-book-fairs">
              <Button className="w-full">Browse Upcoming Book fair</Button>
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
                <p className="font-medium text-foreground">{displayUsername}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Role: </p>
                <p className="font-medium text-foreground capitalize">
                  {role || profile?.profession}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Contact No</p>
                <p className="font-medium text-foreground">
                  {profile?.phonenumber}
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
