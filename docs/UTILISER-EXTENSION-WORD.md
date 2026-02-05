# Utiliser l'extension Aurora AI dans Word

Guide pour les utilisateurs finaux : installer et utiliser l'extension Aurora AI dans Microsoft Word.

## Prérequis

- **Microsoft Word** (Windows, Mac) ou **Word sur le web** (office.com)
- Un **compte Aurora AI** (créé sur [aurora-omega.vercel.app](https://aurora-omega.vercel.app))
- Connexion internet  
  *(L’extension est incluse dans les plans Pro et Annuel ; le plan gratuit a des limites.)*

---

## 1. Installer l'extension

### Word Desktop (Windows / Mac) – méthode par URL

1. Ouvrez **Microsoft Word**
2. Allez dans **Insérer** → **Obtenir des modules complémentaires**
3. Cliquez sur **Partager un module** (ou **Mon organisation** selon votre version)
4. Collez cette URL dans le champ prévu :
   ```
   https://aurora-omega.vercel.app/addin/manifest.xml
   ```
5. Validez. L'extension **Aurora AI** apparaît dans le ruban (onglet **Accueil**)

### Word sur le web (office.com) – méthode par fichier

Sur Word en ligne, l’interface n’accepte souvent **pas d’URL** : il faut installer via un fichier.

1. **Téléchargez le manifest** sur votre ordinateur :
   - Ouvrez : [https://aurora-omega.vercel.app/addin/manifest.xml](https://aurora-omega.vercel.app/addin/manifest.xml)
   - Clic droit → **Enregistrer la page sous** (ou **Enregistrer sous**) → sauvegardez en `manifest.xml`

2. Dans Word sur le web :
   - **Insérer** → **Obtenir des modules complémentaires**
   - **Partager un module** (ou **Chargement personnalisé**)
   - **Parcourir** → sélectionnez le fichier `manifest.xml` sur votre ordinateur
   - Validez

3. L’extension **Aurora AI** apparaît dans le ruban (onglet **Accueil**)

### Si l’installation échoue

- Réessayez avec la **méthode par fichier** (même sur Word Desktop)
- Vérifiez votre connexion internet
- Consultez [ADDIN-TROUBLESHOOTING.md](./ADDIN-TROUBLESHOOTING.md)

---

## 2. Se connecter

1. Cliquez sur le bouton **Aurora AI** dans l'onglet Accueil
2. Le volet Aurora AI s'ouvre à droite
3. Connectez-vous avec **le même email et mot de passe** que sur le site Aurora AI

---

## 3. Utiliser les fonctionnalités

L'extension propose les mêmes actions que le site :

### Formatage Intelligent
- **Auto-formatter tout** : formate tout le document (titres, listes, espacements)
- **Corriger les erreurs** : orthographe, grammaire, ponctuation
- **Améliorer espacements** : mise en forme des paragraphes

### Assistant Rédaction
- **Continuer l'écriture** : l'IA continue le texte à la fin du document
- **Convertir en titre** : transforme la sélection en titre (H1, H2, H3)
- **Améliorer paragraphe** : améliore le paragraphe sélectionné

### Insérer
- **Tableau formaté** : insère un tableau généré par l'IA
- **Résumé statistiques** : résume le document avec statistiques

### Traduction
- Choisissez la langue cible dans la liste
- **Traduire le document** : traduit tout
- **Traduire la sélection** : traduit uniquement le texte sélectionné

### Idées
- **Suggérer un plan** : génère une structure/plan pour le document

---

## 4. Conseils d'utilisation

- **Sans sélection** : Auto-formatter, Corriger erreurs, Améliorer espacements, Traduire le document, Continuer l'écriture → agissent sur tout le document
- **Avec sélection** : Améliorer paragraphe, Convertir en titre, Traduire la sélection → agissent sur le texte sélectionné
- Utilisez le même compte que sur le site pour garder votre quota (gratuit ou abonné)

---

## 5. Abonnement expiré

Lorsque votre abonnement Pro ou Annuel expire :

- Vous pouvez toujours **ouvrir** l’extension et vous connecter
- Les **actions IA** (formatage, traduction, etc.) ne fonctionnent plus
- Un message s’affiche : *« Votre abonnement a expiré. Veuillez renouveler pour continuer. »*
- Pour réactiver l’extension : renouvelez votre abonnement sur [aurora-omega.vercel.app/pricing](https://aurora-omega.vercel.app/pricing)

---

## 6. Dépannage

| Problème | Solution |
|----------|----------|
| « Nous n'avons pas pu démarrer ce complément » | Vérifiez votre connexion internet. Utilisez la **méthode par fichier** (voir section 1). |
| Word Web : pas de champ pour coller l’URL | Sur office.com, utilisez la **méthode par fichier** : téléchargez le manifest, puis Parcourir. |
| Erreur de connexion | Vérifiez email/mot de passe. Utilisez le même compte que sur aurora-omega.vercel.app |
| « Votre abonnement a expiré » | Renouvelez sur [aurora-omega.vercel.app/pricing](https://aurora-omega.vercel.app/pricing) |
| Texte non formaté | Assurez-vous d'avoir sélectionné du texte si l'action le requiert (ex. Améliorer paragraphe) |
| Limite atteinte (plan gratuit) | Passez au plan Pro ou Annuel sur le site |

Voir [ADDIN-TROUBLESHOOTING.md](./ADDIN-TROUBLESHOOTING.md) pour plus de détails techniques.
