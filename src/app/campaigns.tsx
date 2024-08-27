import React, { useState, useEffect, useMemo } from 'react';
import { ThirdwebProvider, useContract } from "@thirdweb-dev/react";
import useFora, { Campaign } from '@/lib/fora'; // Assuming the hook is in this file

// Define the structure of our campaign data
interface CampaignData extends Campaign {
  description: string;
  currency: string;
  location: string;
  details: string;
}

// Define the structure of our campaigns object
interface Campaigns {
  [key: string]: CampaignData;
}

const CampaignCard: React.FC<{ campaign: CampaignData }> = ({ campaign }) => {
    const { 
      getCampaignStatus, 
      getFormattedContributions, 
      getRemainingTime, 
      getProgressPercentage,
      canUserContribute,
      contribute 
    } = useFora();
  
    const [status, setStatus] = useState<'active' | 'completed' | 'expired'>('active');
    const [contributions, setContributions] = useState('');
    const [progress, setProgress] = useState(0);
    const [canContribute, setCanContribute] = useState(false);
  
    useEffect(() => {
      const fetchData = async () => {
        setStatus(await getCampaignStatus(campaign));
        setContributions(await getFormattedContributions(campaign));
        setProgress(await getProgressPercentage(campaign));
        setCanContribute(await canUserContribute(campaign));
      };
      fetchData();
    }, [campaign, getCampaignStatus, getFormattedContributions, getProgressPercentage, canUserContribute]);
  
    const handleReserve = async () => {
      if (canContribute) {
        try {
          await contribute(1000, campaign);
          alert('Reservation successful!');
        } catch (error) {
          console.error('Reservation failed:', error);
          alert('Reservation failed. Please try again.');
        }
      }
    };
  
    return (
      <div>
        <h3>{campaign.name}</h3>
        <p>Status: {status}</p>
        <p>Progress: {contributions} / {campaign.threshold} ({progress.toFixed(2)}%)</p>
        <p>Time Remaining: {getRemainingTime(campaign)}</p>
        <button onClick={handleReserve} disabled={!canContribute}>
          {canContribute ? 'Reserve' : 'Already Contributed'}
        </button>
        <a href={campaign.details} target="_blank" rel="noopener noreferrer">See Details</a>
      </div>
    );
  };

const CampaignList: React.FC<{ campaigns: Campaigns }> = ({ campaigns }) => {
  const [filter, setFilter] = useState<'active' | 'all' | 'successful'>('active');
  const { getTotalContributions, contribute, isCampaignCompleted, isCampaignDeadlineExceeded } = useFora();

  const [campaignStates, setCampaignStates] = useState<{[key: string]: {
    totalContributions: number;
    isCompleted: boolean;
    isDeadlineExceeded: boolean;
  }}>({});

  useEffect(() => {
    const fetchCampaignStates = async () => {
      const states: {[key: string]: any} = {};
      for (const [name, campaign] of Object.entries(campaigns)) {
        states[name] = {
          totalContributions: await getTotalContributions(campaign),
          isCompleted: await isCampaignCompleted(campaign),
          isDeadlineExceeded: await isCampaignDeadlineExceeded(campaign),
        };
      }
      setCampaignStates(states);
    };

    fetchCampaignStates();
  }, [campaigns, getTotalContributions, isCampaignCompleted, isCampaignDeadlineExceeded]);

  const filteredCampaigns = useMemo(() => {
    return Object.entries(campaigns).filter(([name, campaign]) => {
      const state = campaignStates[name];
      if (!state) return false;
      
      switch (filter) {
        case 'active':
          return !state.isCompleted && !state.isDeadlineExceeded;
        case 'successful':
          return state.isCompleted;
        default:
          return true;
      }
    });
  }, [campaigns, campaignStates, filter]);

  const handleReserve = async (campaign: CampaignData) => {
    try {
      // For simplicity, we're contributing a fixed amount. You might want to make this dynamic.
      await contribute(1000, campaign);
      alert('Reservation successful!');
    } catch (error) {
      console.error('Reservation failed:', error);
      alert('Reservation failed. Please try again.');
    }
  };

  return (
    <div>
      <select value={filter} onChange={(e) => setFilter(e.target.value as any)}>
        <option value="active">Active Campaigns</option>
        <option value="all">All Campaigns</option>
        <option value="successful">Successful Campaigns</option>
      </select>

      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {filteredCampaigns.map(([name, campaign]) => {
          const state = campaignStates[name];
          if (!state) return null;

          return (
            <div key={name} style={{ border: '1px solid black', margin: '10px', padding: '10px', width: '300px' }}>
              <h3>{name}</h3>
              <p>{campaign.description}</p>
              <p>Location: {campaign.location}</p>
              <p>Progress: {state.totalContributions} / {campaign.threshold}</p>
              <button onClick={() => handleReserve(campaign)}>Reserve</button>
              <a href={campaign.details} target="_blank" rel="noopener noreferrer">See Details</a>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaigns>({});

  useEffect(() => {
    // In a real app, you'd probably fetch this from an API
    fetch('/campaigns.json')
      .then(response => response.json())
      .then(data => setCampaigns(data));
  }, []);

  return (
    <ThirdwebProvider activeChain="ethereum">
      <CampaignList campaigns={campaigns} />
    </ThirdwebProvider>
  );
};

export default App;