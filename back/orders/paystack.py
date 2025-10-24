"""
Paystack payment integration for Ghana
"""
import requests
from decimal import Decimal
from django.conf import settings
from decouple import config


class PaystackAPI:
    """Paystack API client for payment processing"""
    
    BASE_URL = "https://api.paystack.co"
    
    def __init__(self):
        self.secret_key = config('PAYSTACK_SECRET_KEY', default='')
        self.public_key = config('PAYSTACK_PUBLIC_KEY', default='')
        
    def _get_headers(self):
        return {
            'Authorization': f'Bearer {self.secret_key}',
            'Content-Type': 'application/json',
        }
    
    def initialize_transaction(self, email, amount, reference, callback_url=None, metadata=None):
        """
        Initialize a payment transaction
        
        Args:
            email: Customer email
            amount: Amount in pesewas (GHS * 100)
            reference: Unique transaction reference
            callback_url: URL to redirect after payment
            metadata: Additional data (order details, etc.)
        
        Returns:
            dict: Response with authorization_url and access_code
        """
        url = f"{self.BASE_URL}/transaction/initialize"
        
        payload = {
            'email': email,
            'amount': int(amount * 100),  # Convert to pesewas
            'reference': reference,
            'currency': 'GHS',
        }
        
        if callback_url:
            payload['callback_url'] = callback_url
            
        if metadata:
            payload['metadata'] = metadata
        
        try:
            response = requests.post(url, json=payload, headers=self._get_headers())
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            return {
                'status': False,
                'message': str(e)
            }
    
    def verify_transaction(self, reference):
        """
        Verify a transaction
        
        Args:
            reference: Transaction reference
            
        Returns:
            dict: Transaction details
        """
        url = f"{self.BASE_URL}/transaction/verify/{reference}"
        
        try:
            response = requests.get(url, headers=self._get_headers())
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            return {
                'status': False,
                'message': str(e)
            }
    
    def list_banks(self):
        """
        Get list of banks for Ghana
        
        Returns:
            dict: List of banks
        """
        url = f"{self.BASE_URL}/bank?country=ghana"
        
        try:
            response = requests.get(url, headers=self._get_headers())
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            return {
                'status': False,
                'message': str(e)
            }
    
    def create_transfer_recipient(self, account_number, bank_code, name):
        """
        Create a transfer recipient for payouts
        
        Args:
            account_number: Bank account number
            bank_code: Bank code from list_banks
            name: Account holder name
            
        Returns:
            dict: Recipient details
        """
        url = f"{self.BASE_URL}/transferrecipient"
        
        payload = {
            'type': 'ghipss',
            'name': name,
            'account_number': account_number,
            'bank_code': bank_code,
            'currency': 'GHS',
        }
        
        try:
            response = requests.post(url, json=payload, headers=self._get_headers())
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            return {
                'status': False,
                'message': str(e)
            }


# Singleton instance
paystack = PaystackAPI()
