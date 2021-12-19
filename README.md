# Messenger Clone

L'objectif de ce TP est de recréer un site de messagerie, très similaire à messenger. 

Pour cela, nous allons utiliser la librairie Socket.io avec Node.js, qui nous permettra d'ouvir des communications full-duplex avec chaque personne connectée sur le site. 

Toute la partie client sera vue avec Benjamin, vous ne serez donc pas notés sur cette partie là pour ce projet.

Ici nous allons donc utiliser le client suivant: https://teach-vue-chat-build-hosted.glitch.me/

Je vous invite à utiliser Glitch https://glitch.com (cela permet d'outre passer le pare-feu de l'IUT, qui bloque les connexions à l'atlas de MongoDB, et donc à la base de données). 

Vous pouvez cloner ce projet dans Glitch, et contribuer à plusieurs personnes en même temps dessus.

L'addresse du serveur de démo mis en ligne est la suivante: wss://teach-vue-chat-server.glitch.me

La notation est sur 100 points. 80 seront accordés pour les fonctionnalités, et 20 pour la qualité du code. 
Des bonus pourront être appliqués si l'application propose des fonctionnalités non demandées. 

## 1. Architecture *(15 pts)*

Votre application devra utiliser Express, MongoDB, Socket.io & tout ce dont vous pourriez avoir besoin en plus. 

L'architecture de la base MongoDB sera décomposé en 3 schémas: 
- User (Défini par un nom)
- Conversation (Définie par un id)
- Message (Défini par un id)

Je vous laisserai trouver chaque contenu des schémas. 

*Hint: Vous pouvez **fortement** vous inspirez des morceaux de JSON que l'on envoie au client, dans la suite de l'énnoncé.*

## 2. Fonctionnement général *(15 pts)*

### __ROMAIN__ 2.1 Création d'un utilisateur en base de données *(5 pts)*

Lors de la première connexion d'un utilisateur, ce dernier rentre son nom et son mot de passe. 
S'il existe, alors l'utilisateur est connecté, s'il n'existe pas, nous allons le créer dans ce cas. 

__Informations d'authentification au serveur :__
```
Identifiant : drinkteam
Mot de passe : drinkteam
Adresse du serveur : 5.196.26.2 | romainmunier.ovh
```

__Informations de connexion à la base de données :__
```
Identifiant : messenger
Mot de passe : drinkteam
Adresse du serveur : INCONNUE
```

__Adresse du serveur de développement :__
```
IP Eduroam : 172.31.247.89
```

__Adresse des plateformes :__
```
Web : 172.31.247.89:8080
API : 172.31.247.89:3000
```

### __LUCAS__ 2.2 Attribution d'un token d'authentification *(10 pts)*

Vous allez devoir générer un token pour un utilisateur boloss lorsqu'il se connecte. Vous pouvez utiliser la librairie jwt (jsonwebtoken) vu précédemment dans les TDs.

Ce token sera envoyé à chaque requête du client au serveur, et c'est ce qui nous permettra d'identifier quel utilisateur nous fait une requête.
Vous pouvez le stocker en base de données si nécéssaire.

### 2.3 Autres informations


Une fois sur la page principale, l'utilisateur peut voir toutes les personnes disponibles sur l'application. Il peut ensuite décider d'en choisir une ou plus pour créer une conversation. 

Lorsque la conversation est crée, chaque participant peut décider d'ajouter ou de retirer un autre participant. 

Bien entendu, chaque participant peuvent envoyer des messages, les éditer ou les supprimer, et également réagir à chaque message. 

## 3. Communication avec le client *(30 pts)*

Puisque nous travaillons avec un client qui n'est pas fait par vos soins, je vais vous donner les informations qui sont envoyés par ce dernier à chaque évènements. 

Vous allez devoir traiter les informations envoyées par le client, effectuer le traitement du serveur, puis lui renvoyer les données. 

### __ROMAIN__ 3.1 Les codes de retour

Lors de votre réponse, vous devrez préciser un code dans votre message de retour. Les possibilitées pour ce code sont les suivantes : 
- SUCCESS (tout s'est bien déroulé)
- NOT_AUTHENTICATED (dans le cas ou un utilisateur n'est pas connecté)
- NOT_FOUND_USER (l'utilisateur spécifié n'as pas été trouvé dans la base)
- NOT_FOUND_CONVERSATION
- NOT_FOUND_MESSAGE
- NOT_VALID_USERNAMES (liste de noms d'utilisateur pour créer une conversation pas valide)
- NOT_VALID_CONTENT (contenu du message non valide, très généralement s'il est vide)

### 3.2 Contenu de la réponse envoyé au client

Chaque réponse envoyée au client sera au format JSON, vous aurez donc un corps de réponse qui sera tout le temps similaire au suivant: 

```json
{
    "code": "SUCCESS",
    "data": {...}
}
```

### 3.3 La liste des évènements à écouter

Chaque évènement de socket que vous allez écouter contiendra un objet de données, permettant au client & au serveur de communiquer correctement. Il y a également une callback de retour, qui nous permet d'envoyer directement au client le retour de sa requête. 


Vous allez devoir écouter les évènements de la manière qui suit: 

```js
// /!\ Pensez bien au @ devant chaque évènement, c'est la nomenclature du client ! 
socket.on("@evenement", ({data}, callback) => {
    //Traitement

    //Réponse à envoyer
    callback({code: "SUCCESS", data: {...}});
});

```

#### 3.3.1 __MATH__ Authentification *(2 pts)*

Lors de l'authentification, le client nous envoie une requête socket, nommée **authenticate**. 

Le corps de la requête est comme suit: 

```json
{
    "username":"John",
    "password":"123456"
}
``` 

Le traitement de cette requête doit permettre à l'utilisateur de se connecter, et s'il ne s'est jamais connecté auparavant, de créer son compte.
C'est à ce moment que l'on va créer l'utilisateur dans la base de données Mongo.

Le client s'attends à une réponse avec l'objet data suivant: 

```json
{
    "username":"John",
    "token": "monsupertokendauthentification",
    "picture_url": "https://lelienversmasuperphotodeprofile.fr"
}
```

#### 3.3.2 __Quent1__ Récupération de la liste d'utilisateurs *(2 pts)*

La requête est du nom suivant: **getUsers**. 

Le corps de la requête est comme suit: 

```json
{
    "token":"monsupertokenjevousl'aipasdéjàditqu'ilétaitbienmontoken?"
}
``` 

Le traitement sert à récupérer la liste des utilisateurs présents dans la conversation.
Il vous faudra accéder a la base MongoDB et récupérer tout les utilisateurs.

Le client s'attends à une réponse sous ce format:

```json
{
    "users": [
        {"username": "JohnToujours", "picture_url":"https://vousavezcompris", "awake": true},
        ...
    ]
}
``` 

#### 3.3.3 __Mika__ __Math__ Récupération ou création d'une conversation one to one *(4 pts)*

La requête est du nom suivant: **getOrCreateOneToOneConversation**. 

Le corps de la requête est comme suit: 

```json
{
    "token":"cmontoken",
    "username":"Jane"
}
``` 

Permet de créer une conversation avec 1 autre personne. 
L'objet Conversation devra être crée en base de données. 

La réponse attendue: 

```json
{
    "conversation": {
        "id":1,
        "type":"one_to_one",
        "participants": ["John", "Jane"],
        "messages": [{...}],
        "title": "Cmaconversation",
        "theme": "BLUE",
        "updated_at": "1995-12-17T03:24:00",
        "seen": {},
        "typing": {}
    }
}
```

#### 3.3.4 __Lucas__ __Math__ Récupération ou création d'un conversation many to many *(4 pts)*

La requête est du nom suivant: **getOrCreateManyToManyConversation**. 

Le corps de la requête est comme suit: 

```json
{
    "token":"cmontoken",
    "usernames": ["Jane", "John", "Alfred"]
}
``` 


Permet de créer une conversation avec plusieurs autres personne.
Idem, l'objet Conversation devra être crée en base de données. 

La réponse attendue: 

```json
{
    "conversation": {
        "id":1,
        "type":"many_to_many",
        "participants": ["John", "Jane"],
        "messages": [{...}],
        "title": "Cmaconversationaplusieurs",
        "theme": "BLUE",
        "updated_at": "1995-12-17T03:24:00",
        "seen": {},
        "typing": {}
    }
}
```

#### __Quent1__ 3.3.5 Récupération de toutes les conversations *(2 pts*)

La requête est du nom suivant: **getConversations**. 

Le corps de la requête est comme suit: 

```json
{
    "token":"cmontoken"
}
```

Permet de récupérer toutes les conversations ou un utilisateur est présent.

La réponse attendue: 

```json
{
    "conversations": [{
        "id":1,
        "type":"one_to_one",
        "participants": ["John", "Jane"],
        "messages": [{...}],
        "title": "Cmaconversation",
        "theme": "BLUE",
        "updated_at": "1995-12-17T03:24:00",
        "seen": {},
        "typing": {}
    },
    ...
    ]
}
```

#### 3.3.6 Envoi de message dans une conversation *(8 pts*)

La requête est du nom suivant: **postMessage**. 

Le corps de la requête est comme suit: 

```json
{
    "token":"ctjrsmontoken",
    "conversation_id": 1,
    "content": "Quelle est la superficie de la Nouvelle-Guinée ?"
}
``` 

La réponse attendue: 

```json
{
    "message": {
        "id":1,
        "from":"John",
        "content": "Comment est votre blanquette ?",
        "posted_at": "1995-12-17T03:24:00",
        "delivered_to": ["John": "1995-12-17T03:24:00", ...],
        "reply_to": null,
        "edited": false,
        "deleted": false,
        "reactions": {}
    }
}
```

#### 3.3.7 Edition d'un message *(2 pts*)

La requête est du nom suivant: **editMessage**. 

Le corps de la requête est comme suit: 

```json
{
    "token":"ilétjrslàcmontokenamoirienquamoi",
    "conversation_id": 1,
    "message_id": 1,
    "content": "Quelle est la superficie de la Nouvelle-Guinée ?"
}
``` 

La réponse attendue ne contient rien dans l'objet data, seulement le code de retour.


#### 3.3.8 Répondre à un message *(2 pts*)

La requête est du nom suivant: **editMessage**. 

Le corps de la requête est comme suit: 

```json
{
    "token":"montoken?",
    "conversation_id": 1,
    "message_id": 1,
    "content": "Quelle est la superficie de la Nouvelle-Guinée ?"
}
``` 

La réponse attendue: 

```json
{
    "message": {
        "id":1,
        "from":"John",
        "content": "Comment est votre blanquette ?",
        "posted_at": "1995-12-17T03:24:00",
        "delivered_to": ["John": "1995-12-17T03:24:00", ...],
        "reply_to": null,
        "edited": false,
        "deleted": false,
        "reactions": {}
    }
}
```

#### 3.3.9 Delete message *(2 pts*)

La requête est du nom suivant: **deleteMessage**.
Le corps de la requête est comme suit: 

```json
{
    "token":"untokenpourlesgouvernertous",
    "conversation_id": 1,
    "message_id": 1 ,
    "content": "Voix ambigue d'un coeur qui au zéphyr préfère les jattes de kiwi"
}
``` 

La réponse attendue ne contient rien dans l'objet data, seulement le code de retour.

#### 3.3.10 Réagir à un message *(2 pts*)

La requête est du nom suivant: **reactMessage**.
Le corps de la requête est comme suit: 

```json
{
    "token":"untokenpourlesgouvernertous",
    "conversation_id": 1,
    "message_id": 1 
    "reaction": "HEART" 
}
``` 

Les valeurs possibles pour les réactions sont: **HEART, THUMB, HAPPY, SAD**

La réponse attendue ne contient rien dans l'objet data, seulement le code de retour.


### 3.4 La liste des évènement à envoyer *(20 pts)*

Le serveur doit informer tout les clients des changements dans la base de données, pour que chaque client puisse réagir en fonction de ces derniers, et rafraichir l'UI avec les nouvelles informations. 


Pour cela, le serveur envoie des évènements socket, de la même manière que le client le fait. 


Pour rappel, pour envoyer un évènement à un socket en particulier, on peut utiliser la ligne

```js
socket.emit("@monEvenement", data); //data étant un objet contenant ce que l'on veut envoyer.
```

#### 3.4.1 Création d'utilisateur *(3 pts)*

Le nom de cet évènement est **userCreated**.
Le serveur doit envoyer l'évènement à chaque fois qu'un utilisateur est ajouté a la base de données.


Le corps de l'objet data doit être le suivant : 

```json
{
    "user": {
        "username":"John",
        "password": null,
        "picture_url":"https://monsuperlienversmasuperphoto.com",
        "last_activity_at": "1995-12-17T03:24:00"
    }
}
```


#### 3.4.2 Création de conversation *(3 pts)*

Le nom de l'évènement est **conversationCreated**.
Le serveur doit envoyer cet évènement à chaque création de conversation, à tout les clients.

Le corps de l'objet est: 

```json
{
    "id":1,
    type:"one_to_one",
    participants:["John", "Jane"],
    messages:[],
    title: null,
    theme: "BLUE",
    updated_at: "1995-12-17T03:24:00",
    typing: []
}
```

#### 3.4.3 Nouveau message *(4 pts)*

Le nom de l'évènement est **messagePosted**.
Le serveur doit envoyer cet évènement à chaque nouveau message sur une conversation, aux clients concernés.

Le corps de l'objet est: 

```json
{
    "conversation_id":1,
    "message":{
        "id":1,
        "from":"John",
        ...
    }
}
```

#### 3.4.4 Conversation vue *(3 pts)*

Le nom de l'évènement est **conversationSeen**.
Le serveur doit envoyer cet évènement à chaque fois qu'un participant a une conversation a lu un nouveau message de la conversation.

Le corps de l'objet data est une conversation, définie comme suit: 

```json
{
    "id":1,
    "type":"many_to_many",
    "participants": ["John", "Jane", "Alfred"],
    "messages": [{...}],
    "title": "Cmaconversationaplusieurs",
    "theme": "BLUE",
    "updated_at": "1995-12-17T03:24:00",
    "seen": {},
    "typing": {}
}
```

#### 3.4.5 Réaction à un message *(3 pts)*

Le nom de l'évènement est **messageReacted**.

Envoyé à chaque fois qu'un utilisateur réagi à un message, à chaque participants de la conversation.

Le corps de l'objet data est le suivant: 
```json
{
    "conversation_id":1,
    "message": {
        "id":1,
        ...
    }
}
```

#### 3.4.6 Message édité *(3 pts)*

Le nom de l'évènement est **messageEdited**.

Il doit être envoyé à chaque fois qu'un utilisateur édite un message, à chaque personne de la conversation ciblée. 

Le corps de l'objet data est le suivant: 
```json
{
    "conversation_id":1,
    "message": {
        "id":1,
        ...
    }
}
```

#### 3.4.7 Message supprimé dans une conversation *(3 pts)*

Le nom de l'évènement est **messageDeleted**.

Ils doivent être envoyés quand un participant supprime un message, à chaque personne présente dans la conversation.

Le corps de l'objet data est le suivant: 
```json
{
    "conversation_id":1,
    "message": {
        "id":1,
        ...
    }
}
```


Happy Hacking !
