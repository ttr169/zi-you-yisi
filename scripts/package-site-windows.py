"""Portable equivalent of the Sites package-site.sh for Windows without WSL."""
import copy,json,pathlib,shutil,sys,tarfile,tempfile
root=pathlib.Path(__file__).resolve().parents[1]
archive=pathlib.Path(sys.argv[1]).resolve()
source=root/'.openai/hosting.json';built=root/'dist/.openai/hosting.json';dist=root/'dist'
if not source.is_file() or not built.is_file() or not (dist/'server/index.js').is_file():raise SystemExit('Missing verified Worker build or hosting metadata')
for p in dist.rglob('*'):
    if p.is_symlink() or not (p.is_file() or p.is_dir()):raise SystemExit(f'Unsupported build entry: {p}')
with tempfile.TemporaryDirectory(prefix='sites-pack-',dir=root/'outputs') as temp:
    staged=pathlib.Path(temp)/'dist';shutil.copytree(dist,staged)
    src=json.loads(source.read_text(encoding='utf-8'));out=json.loads(built.read_text(encoding='utf-8'))
    if src.get('artifact_metadata') is not None and out.get('artifact_metadata') is not None and src['artifact_metadata']!=out['artifact_metadata']:raise SystemExit('Conflicting artifact metadata')
    data=copy.deepcopy(src)
    if out.get('artifact_metadata') is not None:data['artifact_metadata']=out['artifact_metadata']
    target=staged/'.openai/hosting.json';target.parent.mkdir(exist_ok=True);target.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    if (root/'drizzle').is_dir():shutil.copytree(root/'drizzle',staged/'.openai/drizzle',dirs_exist_ok=True)
    archive.parent.mkdir(parents=True,exist_ok=True)
    with tarfile.open(archive,'w:gz') as tar:tar.add(staged,arcname='dist')
with tarfile.open(archive,'r:gz') as tar:
    names=set(tar.getnames())
    if 'dist/.openai/hosting.json' not in names or 'dist/server/index.js' not in names or 'dist/.openai/drizzle/0000_next_sheva_callister.sql' not in names:raise SystemExit('Archive validation failed')
print(archive)
