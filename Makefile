generate-supergraph:
	npx mesh-compose -o supergraph.graphql

run:
	npx hive-gateway supergraph

rebuild:
	DEBUG=1 npx mesh-compose -o supergraph.graphql
	@echo ""
	clear
	DEBUG=1 npx hive-gateway supergraph


