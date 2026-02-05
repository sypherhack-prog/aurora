# Dépannage add-in Word Aurora AI

## L'add-in affiche « Nous n'avons pas pu démarrer ce complément »

### Checklist Vercel (à faire en priorité)

1. **NEXTAUTH_URL** : Doit être exactement `https://aurora-omega.vercel.app` (sans `.com` à la fin).
   - ❌ `aurora-omega.vercel.app.com` est incorrect
   - ✅ `https://aurora-omega.vercel.app`

2. **SITE_URL** : À définir = `https://aurora-omega.vercel.app` pour que le manifest pointe vers la bonne URL.

3. **Redéployer** après avoir modifié les variables d'environnement.

### Vérifications

- **Tâche pane dans le navigateur** : Ouvrez https://aurora-omega.vercel.app/addin/taskpane.html  
  Si la page s'affiche, le serveur est OK. Le blocage vient alors de Word (CSP, iframe, etc.).

- **Manifest** : Ouvrez https://aurora-omega.vercel.app/addin/manifest.xml  
  Toutes les URLs doivent contenir `aurora-omega.vercel.app` (pas `aurora-xxx-xxx.vercel.app`).

- **Réinstaller l'add-in** :  
  1. Téléchargez le manifest : https://aurora-omega.vercel.app/addin/manifest.xml → Enregistrer sous  
  2. Word → Insérer → Obtenir des modules complémentaires → Partager un module → Parcourir  
  3. Sélectionnez le fichier `manifest.xml` téléchargé

### Erreurs CSP "artifacts.dev.azure.com" dans la console

Ces erreurs **ne viennent pas de notre add-in** : c'est Word/Office qui charge des source maps (.js.map) depuis Azure DevOps. La CSP de Microsoft les bloque. On ne peut pas les corriger et elles n'impactent pas notre add-in. Filtrez la console par `aurora-omega.vercel.app` pour voir nos erreurs.

### Word Desktop vs Word sur le web (office.com)

| Plateforme | Installation |
|------------|--------------|
| **Word Desktop** (Windows/Mac) | URL ou fichier |
| **Word sur le web** (office.com) | Fichier uniquement : téléchargez le manifest puis Parcourir |

### Si ça ne fonctionne toujours pas

- Essayez l'autre plateforme (Web ou Desktop). Utilisez la méthode par fichier si l'URL ne marche pas.
- L'add-in peut se comporter différemment selon la plateforme.
- Videz le cache Office : [Procédure Microsoft](https://learn.microsoft.com/en-us/office/dev/add-ins/testing/clear-cache)
