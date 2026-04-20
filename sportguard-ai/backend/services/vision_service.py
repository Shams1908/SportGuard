import io
from google.cloud import vision
from core.gcp_clients import GCPClients
# from engine.phash import calculate_hamming_distance

def hunt_infringements(image_path: str) -> list[dict]:
    """
    Uses the WEB_DETECTION feature of the Google Cloud Vision API to locate
    infringing instances of a sports asset across the web.
    """
    client = GCPClients.get_vision()

    # Read the image content
    with io.open(image_path, 'rb') as image_file:
        content = image_file.read()

    image = vision.Image(content=content)

    # Perform the Web Detection request
    response = client.web_detection(image=image)
    if response.error.message:
        raise Exception(f"Vision API Error: {response.error.message}")

    annotations = response.web_detection
    
    # 1. Extract Web Entities
    web_entities = annotations.web_entities
    
    # 2. Extract Full Matching Images
    full_matching_images = annotations.full_matching_images
    
    # 3. Extract Visually Similar Images
    visually_similar_images = annotations.visually_similar_images
    
    infringements = []

    # Append Full Matches
    if full_matching_images:
        for img in full_matching_images:
            infringements.append({
                "url": img.url,
                "page_title": "Direct Image URL (Full Match)"
            })
            
    # Append Visually Similar Matches
    if visually_similar_images:
        for img in visually_similar_images:
            infringements.append({
                "url": img.url,
                "page_title": "Direct Image URL (Visually Similar)"
            })

    # Bonus: Pages with matching images often provide the actual page title context.
    if annotations.pages_with_matching_images:
        for page in annotations.pages_with_matching_images:
            infringements.append({
                "url": page.url,
                "page_title": page.page_title if page.page_title else "Page matching image"
            })

    # TODO: Download the web images discovered from the URLs above, generate their pHash, 
    # and route them back through the calculate_hamming_distance(hash1, hash2) function 
    # from our engine.phash module to mathematically confirm the infringement.

    return infringements
