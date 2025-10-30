import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: API для работы с гайдами Dota 2 (получение, создание, комментирование)
    Args: event - dict with httpMethod, body, queryStringParameters
          context - object with attributes: request_id, function_name
    Returns: HTTP response dict
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cursor = conn.cursor()
    
    try:
        if method == 'GET':
            params = event.get('queryStringParameters') or {}
            hero_id = params.get('heroId')
            
            if hero_id:
                cursor.execute(
                    "SELECT g.id, g.hero_id, g.hero_name, g.author, g.skills, g.items, g.description, "
                    "g.facet, g.created_at::text FROM guides g WHERE g.hero_id = %s ORDER BY g.created_at DESC",
                    (int(hero_id),)
                )
            else:
                cursor.execute(
                    "SELECT g.id, g.hero_id, g.hero_name, g.author, g.skills, g.items, g.description, "
                    "g.facet, g.created_at::text FROM guides g ORDER BY g.created_at DESC"
                )
            
            guides_data = cursor.fetchall()
            guides = []
            
            for guide_row in guides_data:
                guide_id = guide_row[0]
                
                cursor.execute(
                    "SELECT author, text, rating FROM comments WHERE guide_id = %s ORDER BY created_at DESC",
                    (guide_id,)
                )
                comments_data = cursor.fetchall()
                comments = [{'author': c[0], 'text': c[1], 'rating': c[2]} for c in comments_data]
                
                guides.append({
                    'id': guide_id,
                    'heroId': guide_row[1],
                    'heroName': guide_row[2],
                    'author': guide_row[3],
                    'skills': guide_row[4],
                    'items': guide_row[5],
                    'description': guide_row[6],
                    'facet': guide_row[7],
                    'createdAt': guide_row[8],
                    'comments': comments
                })
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'guides': guides}),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            action = body.get('action')
            
            if action == 'create_guide':
                cursor.execute(
                    "INSERT INTO guides (hero_id, hero_name, author, skills, items, description, facet) "
                    "VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING id",
                    (
                        body['heroId'],
                        body['heroName'],
                        body['author'],
                        body.get('skills', ''),
                        body.get('items', ''),
                        body.get('description', ''),
                        body.get('facet', '')
                    )
                )
                guide_id = cursor.fetchone()[0]
                conn.commit()
                
                return {
                    'statusCode': 201,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'id': guide_id, 'message': 'Guide created'}),
                    'isBase64Encoded': False
                }
            
            elif action == 'add_comment':
                cursor.execute(
                    "INSERT INTO comments (guide_id, author, text, rating) VALUES (%s, %s, %s, %s) RETURNING id",
                    (body['guideId'], body['author'], body['text'], body['rating'])
                )
                comment_id = cursor.fetchone()[0]
                conn.commit()
                
                return {
                    'statusCode': 201,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'id': comment_id, 'message': 'Comment added'}),
                    'isBase64Encoded': False
                }
        
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    finally:
        cursor.close()
        conn.close()