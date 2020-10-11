const server = require( 'express' ).Router( );
const { Product, Media, Category } = require( '../db.js' );
const { Op } = require( 'sequelize' );

server.get( '/search', ( request, response, next ) => {
	const { query } = request.query;
	
	if ( !query )
	{
		return response.sendStatus( 400 );
	}
	
	const likeQuery = `%${ query }%`;
	
	Product.findAll( {
		where: {
			[ Op.or ]: [
				{ name: { [ Op.iLike ]: likeQuery } },
				{ description: { [ Op.iLike ]: likeQuery } }
			]
		},
		include: [
			{ model: Media },
			{ model: Category }
		]

	} ).then( ( products ) => {
		if ( !products ) {
			return response.sendStatus( 404 );
		}
		
		response.status( 200 ).send( products );
	} );
} );

module.exports = server;