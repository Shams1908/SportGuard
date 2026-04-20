import urllib.parse
import google.generativeai as genai
from core.config import Config

def draft_legal_notice(infringement_metadata: dict):
    """
    Uses Gemini to draft a professional, localized DMCA/Cease & Desist notice 
    based on the origin of the infringement.
    """
    # Initialize the model
    model = genai.GenerativeModel('gemini-1.5-pro')
    
    # Extract the TLD from the URL to determine language localization
    target_url = infringement_metadata.get('url', '')
    parsed_url = urllib.parse.urlparse(target_url if '://' in target_url else 'http://' + target_url)
    domain_parts = parsed_url.netloc.split('.')
    tld = domain_parts[-1] if len(domain_parts) > 1 else ""
    
    # Construct the instruction and the localization rule
    prompt = f"""
    You are a Digital Rights Attorney. Your task is to draft a legally sound DMCA Takedown 
    or Cease & Desist notice.

    Here is the metadata of the infringement:
    - Target URL: {target_url}
    - Original Media pHash: {infringement_metadata.get('phash', 'N/A')}
    - Source Image Context: {infringement_metadata.get('source_context', 'Sporting Event Asset')}
    - Detection Time: {infringement_metadata.get('timestamp', 'N/A')}
    - Owner/Client: SportGuard AI (On behalf of Shambhavi)

    CRITICAL INSTRUCTION - LOCALIZATION:
    Analyze the top-level domain (TLD) of the Target URL, which is '.{tld}'. 
    You MUST automatically draft the legal notice in the corresponding primary local language 
    for that TLD (e.g., if '.es', use Spanish; if '.fr', use French; if '.jp', use Japanese). 
    If the TLD is generic (like .com, .net, .org, or empty), or you cannot confidently determine a region, 
    use English.

    Ensure the tone is firm, incorporates modern global copyright legal standard references (applicable in 2026), 
    and is structured professionally for a formal email.
    """
    
    # Generate the legal notice
    response = model.generate_content(prompt)
    return response.text
