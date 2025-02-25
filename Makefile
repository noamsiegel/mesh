generate-supergraph:
	npx mesh-compose -o supergraph.graphql

run:
	npx hive-gateway supergraph

rebuild:
	DEBUG=1 npx mesh-compose -o supergraph.graphql
	@echo ""
	clear
	DEBUG=1 npx hive-gateway supergraph

publish-travelport:
	hive schema:publish \
		--registry.accessToken 299217d237674a0ca5163fe0da7930cd \
		--service="travelport" \
		--url="http://fake.com/users/graphql" \
		--author "Noam Siegel" \
		--commit "First" \
		supergraph.graphql