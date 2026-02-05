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

### Si ça ne fonctionne toujours pas

- Utilisez **Word sur le web** (office.com) pour tester : l’add-in peut se comporter différemment.
- Videz le cache Office : [Procédure Microsoft](https://learn.microsoft.com/en-us/office/dev/add-ins/testing/clear-cache)
