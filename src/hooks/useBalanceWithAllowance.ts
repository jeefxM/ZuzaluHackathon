import { CHAIN, CONTRACT_ADDRESS, PRIZE_TOKEN_IS_NATIVE } from "@/casino-config";
import { getWethAddress } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
// import { toast } from "sonner";
import { erc20Abi, zeroAddress, type Address } from "viem";
import {
  useBalance,
  usePublicClient,
  useReadContracts,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";

export function useBalanceWithAllowance({
  address,
  token,
  target,
  onAllowanceUpdated,
}: {
  address?: Address;
  token?: Address;
  target: Address;
  onAllowanceUpdated?: () => void;
}) {
  const client = usePublicClient();
  const isNativeToken = token === zeroAddress
  console.log("get blaance chain/token", client?.chain.id, isNativeToken, getWethAddress(String(client?.chain.id ?? 1)))
  const { data: tokenBalanceData, refetch } = useReadContracts({
    allowFailure: false,
    contracts: [
      {
        abi: erc20Abi,
        address: token,
        functionName: "balanceOf",
        args: [address!],
      },
      {
        abi: erc20Abi,
        address: token,
        functionName: "allowance",
        args: [address!, target],
      },
    ],
    query: { enabled: !isNativeToken  && !!address },
  });

  const { writeContractAsync } = useWriteContract();

  const {
    data: hash,
    isPending,
    mutateAsync: increaseAllowance,
  } = useMutation({
    async mutationFn({ amount }: { amount: bigint }) {
      if (!address || !token) return;

      const hash = await writeContractAsync({
        chain: CHAIN,
        type: "eip1559",
        abi: erc20Abi,
        address: token,
        functionName: "approve",
        args: [target, amount],
      });

      // toast.promise(async () => client?.waitForTransactionReceipt({ hash }), {
      //   loading: "Waiting for confirmation…",
      //   action: {
      //     label: "Explorer",
      //     onClick(e) {
      //       e.preventDefault();
      //       window.open(
      //         `${CHAIN.blockExplorers.default.url}/tx/${hash}`,
      //         "_blank"
      //       );
      //     },
      //   },
      //   success: "Allowance updated successfully",
      //   error: "Error!",
      //   finally() {
      //     refetch();
      //     onAllowanceUpdated?.();
      //   },
      // });

      return hash;
    },
  });

  const { isFetching: isWaitingForConfirmation } = useWaitForTransactionReceipt(
    {
      hash,
    }
  );

  const { data: nativeBalanceData } = useBalance({ address });

  const [tokenBalance, allowance] = tokenBalanceData ?? [];

  const balance =
    (isNativeToken ? nativeBalanceData?.value : tokenBalance) ?? 0n;

  return {
    balance,
    allowance,
    increaseAllowance,
    isPendingAllowance: isPending || isWaitingForConfirmation,
    refetch,
  };
}
