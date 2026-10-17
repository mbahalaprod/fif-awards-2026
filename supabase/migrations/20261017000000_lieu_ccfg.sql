-- La 4ᵉ édition a lieu au Centre Culturel Franco-Guinéen (et non plus au Radisson Blu).
alter table public.parametres
  alter column adresse set default 'Centre Culturel Franco-Guinéen, Conakry, Guinée';

update public.parametres
  set adresse = 'Centre Culturel Franco-Guinéen, Conakry, Guinée'
  where id = 1 and adresse ilike '%radisson%';

update public.actualites
  set texte = replace(texte, 'au Radisson Blu de Conakry', 'au Centre Culturel Franco-Guinéen de Conakry')
  where texte like '%Radisson Blu%';
