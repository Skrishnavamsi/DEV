from twilio.rest import Client
import os
from dotenv import load_dotenv

load_dotenv()

account_sid = os.getenv('TWILIO_ACCOUNT_SID')
auth_token = os.getenv('TWILIO_AUTH_TOKEN')

def setup_twilio_client():
    try:
        client = Client(account_sid, auth_token)
        # Verify the connection by fetching the account details
        account = client.api.accounts(account_sid).fetch()
        print(f"Twilio client set up successfully. Account SID: {account.sid}")
        print(f"Account Name: {account.friendly_name}")
        print(f"Account Status: {account.status}")
        return client
    except Exception as e:
        print(f"Error setting up Twilio client: {str(e)}")
        print(f"Account SID: {account_sid}")
        print(f"Auth Token: {'*' * len(auth_token)}")  # Print masked auth token for security
        return None

if __name__ == "__main__":
    setup_twilio_client()
