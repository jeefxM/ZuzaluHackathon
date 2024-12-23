"use client";

import React from "react";
import { useWallet } from "@/app/context/WalletContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Ticket, Wallet, History, Gift } from "lucide-react";
import Avatar from "./Avatar";

const ProfilePage = () => {
  const { walletAddress } = useWallet();

  const pastTickets = [
    {
      id: 1,
      lottery: "ZuJapan",
      purchaseDate: "2024-03-20",
      status: "Completed",
      amount: "0.005",
    },
    {
      id: 2,
      lottery: "Gitcoin Round",
      purchaseDate: "2024-03-18",
      status: "Completed",
      amount: "0.002",
    },
  ];

  const claimableWinnings = [
    { id: 1, lottery: "ZuJapan", amount: "0.1", status: "Claimable" },
  ];

  return (
    <div className="p-16 max-w-7xl relative">
      {/* Profile Header with neon effect */}

      <div className="mb-8 flex items-center gap-4">
        {walletAddress && <Avatar address={walletAddress} size={64} />}
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
            Profile Dashboard
            <span className="text-[#00F2FF] text-opacity-50 ml-2">
              / overview
            </span>
          </h1>
          <p className="text-gray-400 font-mono">
            {walletAddress
              ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
              : "Connect your wallet"}
          </p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-black border border-[#7958FF] border-opacity-20 p-1 w-fit">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-[#7958FF] data-[state=active]:bg-opacity-10 data-[state=active]:text-[#00F2FF] px-6"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="tickets"
            className="data-[state=active]:bg-[#7958FF] data-[state=active]:bg-opacity-10 data-[state=active]:text-[#00F2FF] px-6"
          >
            Tickets
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="data-[state=active]:bg-[#7958FF] data-[state=active]:bg-opacity-10 data-[state=active]:text-[#00F2FF] px-6"
          >
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Stats Cards with neon borders */}
            <Card className="bg-black border border-[#00F2FF] border-opacity-20 hover:border-opacity-40 transition-all">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">
                  Total Tickets
                </CardTitle>
                <Ticket className="h-4 w-4 text-[#00F2FF]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">12</div>
              </CardContent>
            </Card>

            <Card className="bg-black border border-[#7958FF] border-opacity-20 hover:border-opacity-40 transition-all">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">
                  Total Spent
                </CardTitle>
                <Wallet className="h-4 w-4 text-[#7958FF]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">0.023 ETH</div>
              </CardContent>
            </Card>

            <Card className="bg-black border border-[#FF00FF] border-opacity-20 hover:border-opacity-40 transition-all">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">
                  Active Tickets
                </CardTitle>
                <History className="h-4 w-4 text-[#FF00FF]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">3</div>
              </CardContent>
            </Card>

            <Card className="bg-black border border-[#00F2FF] border-opacity-20 hover:border-opacity-40 transition-all">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">
                  Claimable
                </CardTitle>
                <Gift className="h-4 w-4 text-[#00F2FF]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">0.1 ETH</div>
              </CardContent>
            </Card>
          </div>

          {/* Claimable Winnings Section */}
          <Card className="mt-6 bg-black border border-[#7958FF] border-opacity-20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                Claimable Winnings
                <span className="text-[#7958FF] text-sm font-normal">
                  / rewards
                </span>
              </CardTitle>
              <CardDescription className="text-gray-400">
                Your available rewards from winning tickets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-800">
                    <TableHead className="text-gray-400 font-mono">
                      Lottery
                    </TableHead>
                    <TableHead className="text-gray-400 font-mono">
                      Amount
                    </TableHead>
                    <TableHead className="text-gray-400 font-mono">
                      Status
                    </TableHead>
                    <TableHead className="text-right text-gray-400 font-mono">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {claimableWinnings.map((winning) => (
                    <TableRow key={winning.id} className="border-gray-800">
                      <TableCell className="font-medium text-gray-300">
                        {winning.lottery}
                      </TableCell>
                      <TableCell className="text-[#00F2FF]">
                        {winning.amount} ETH
                      </TableCell>
                      <TableCell>
                        <span className="text-[#FF00FF] bg-[#FF00FF] bg-opacity-10 px-2 py-1 rounded-md text-sm">
                          {winning.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-[#00F2FF] border-opacity-50 bg-[#00F2FF] bg-opacity-5 text-[#00F2FF] hover:bg-opacity-10 hover:border-opacity-100 transition-all"
                        >
                          Claim
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tickets">
          <Card className="bg-black border border-[#FF00FF] border-opacity-20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                Past Tickets
                <span className="text-[#FF00FF] text-sm font-normal">
                  / history
                </span>
              </CardTitle>
              <CardDescription className="text-gray-400">
                A history of all your lottery tickets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-800">
                    <TableHead className="text-gray-400 font-mono">
                      Lottery
                    </TableHead>
                    <TableHead className="text-gray-400 font-mono">
                      Date
                    </TableHead>
                    <TableHead className="text-gray-400 font-mono">
                      Amount
                    </TableHead>
                    <TableHead className="text-gray-400 font-mono">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pastTickets.map((ticket) => (
                    <TableRow key={ticket.id} className="border-gray-800">
                      <TableCell className="font-medium text-gray-300">
                        {ticket.lottery}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {ticket.purchaseDate}
                      </TableCell>
                      <TableCell className="text-[#00F2FF]">
                        {ticket.amount} ETH
                      </TableCell>
                      <TableCell>
                        <span className="text-green-400 bg-green-400 bg-opacity-10 px-2 py-1 rounded-md text-sm">
                          {ticket.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card className="bg-black border border-[#7958FF] border-opacity-20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                Transaction History
                <span className="text-[#7958FF] text-sm font-normal">
                  / all
                </span>
              </CardTitle>
              <CardDescription className="text-gray-400">
                All your past transactions and interactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-gray-400 text-center py-8 font-mono">
                Transaction history will appear here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
