from starknet_py.net.full_node_client import FullNodeClient
from starknet_py.net.models import StarknetChainId
from starknet_py.net.account.account import Account
from starknet_py.net.signer.stark_curve_signer import KeyPair
from starknet_py.contract import Contract
from starknet_py.net.models.transaction import DeployAccountTransaction
import json
import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Load credentials from environment
ACCOUNT_KEY = os.getenv("STARKNET_PRIVATE_KEY")
ACCOUNT_ADDRESS = os.getenv("STARKNET_ACCOUNT_ADDRESS")
STRK_TOKEN_ADDRESS = os.getenv("NEXT_PUBLIC_STRK_TOKEN_ADDRESS")
NETWORK = os.getenv("STARKNET_RPC")

if not all([ACCOUNT_KEY, ACCOUNT_ADDRESS, STRK_TOKEN_ADDRESS, NETWORK]):
    raise ValueError("Missing required environment variables")

async def deploy():
    print("Starting deployment...")
    print(f"Account address: {ACCOUNT_ADDRESS}")
    print(f"Network: {NETWORK}")
    
    # Initialize the client
    client = FullNodeClient(node_url=NETWORK)

    # Initialize account
    key_pair = KeyPair.from_private_key(int(ACCOUNT_KEY, 16))
    account = Account(
        client=client,
        address=ACCOUNT_ADDRESS,
        key_pair=key_pair,
        chain=StarknetChainId.SEPOLIA,
    )

    print("Reading contract files...")
    # Read the compiled contract
    with open("target/dev/betting_BettingContract.contract_class.json", "r") as f:
        contract_def = json.load(f)
    
    with open("target/dev/betting_BettingContract.compiled_contract_class.json", "r") as f:
        casm = json.load(f)

    print("Declaring contract...")
    # Prepare declare transaction
    declare_tx = await account.sign_declare_v2(
        compiled_contract=contract_def,
        compiled_class_hash=casm["class_hash"],
    )
    
    # Send declare transaction
    resp = await account.client.declare(declare_tx)
    await account.client.wait_for_tx(resp.transaction_hash)
    
    class_hash = resp.class_hash
    print(f"Contract declared with class hash: {class_hash}")

    print("Deploying contract instance...")
    # Deploy contract
    deploy_tx = await account.sign_invoke_v1(
        calls=[
            account.execute(
                class_hash=class_hash,
                constructor_calldata=[int(STRK_TOKEN_ADDRESS, 16)],
                salt=os.urandom(32).hex()
            )
        ]
    )
    
    resp = await account.client.send_transaction(deploy_tx)
    await account.client.wait_for_tx(resp.transaction_hash)
    
    contract_address = resp.contract_address
    print(f"Contract deployed successfully!")
    print(f"Contract address: {contract_address}")
    
    # Write the contract address to .env.local
    with open('.env.local', 'a') as f:
        f.write(f"\nNEXT_PUBLIC_CONTRACT_ADDRESS={contract_address}")
    print("Contract address written to .env.local")

if __name__ == "__main__":
    import asyncio
    asyncio.run(deploy()) 