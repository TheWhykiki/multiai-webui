from flask import Blueprint, request, jsonify
import os
import imagehash
from PIL import Image
from shutil import move
from send2trash import send2trash

image_dedup = Blueprint('image_dedup', __name__)

@image_dedup.route('/api/image/dedup', methods=['POST'])
def deduplicate_images():
    try:
        data = request.json
        images_folder = data.get('input_folder')
        output_folder = data.get('output_folder')
        similarity_threshold = data.get('similarity_threshold', 25)
        use_trash = data.get('use_trash', False)

        if not os.path.exists(output_folder):
            os.makedirs(output_folder)

        # List to store image hashes
        unique_hashes = []
        processed_files = 0
        duplicates_found = 0

        for filename in sorted(os.listdir(images_folder)):
            if filename.lower().endswith(('.jpg', '.jpeg', '.png')):
                image_path = os.path.join(images_folder, filename)
                img = Image.open(image_path)

                # Calculate image hash
                img_hash = imagehash.phash(img)

                # Check for similar images
                is_similar = False
                for stored_hash in unique_hashes:
                    if img_hash - stored_hash <= similarity_threshold:
                        is_similar = True
                        break

                if not is_similar:
                    unique_hashes.append(img_hash)
                    move(image_path, os.path.join(output_folder, filename))
                else:
                    duplicates_found += 1
                    if use_trash:
                        send2trash(image_path)
                    else:
                        os.remove(image_path)
                
                processed_files += 1

        return jsonify({
            'success': True,
            'message': 'Deduplication completed successfully',
            'processed_files': processed_files,
            'duplicates_found': duplicates_found,
            'unique_files': processed_files - duplicates_found
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
