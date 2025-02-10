while IFS=r read -r filename; do
	printf "$filename "
	relative_path="${filename%/*}"
	printf "$relative_path "
	relative_path="${relative_path#./}"
	[[ "$relative_path" == "." ]] && relative_path=""
	printf "$relative_path\n"
	sed -i "s|<head>|<head>\n     <link rel=\"canonical\" href=\"https://securecomputer.ai/$relative_path\">|g" "$filename"
done	< <(find . -iname "index.html")
