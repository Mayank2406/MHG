const UserQuery = require('../query/userMaster.query')

const settleEscrow = async ({ query, mid }) => {
    const Escrow = await UserQuery.findOneSpecialMerchant(mid, 'ESCROW');
    const Revenue = await UserQuery.findOneSpecialMerchant(mid, 'REVENUE');
    const order = await UserQuery.findOneOrder(query.order_id);
    const deduct = query.points;

    if (order) {
        throw ({ code: 404, message: 'Order Id already exists', status: 'Fail' });
    }

    if (Escrow && Revenue && !order) {
        // Transfer amount from ESCROW to REVENUE
        if (deduct <= Escrow.price_point_value) {
            var wallet_type = 'ESCROW';
            // 1. update escrow wallet:
            var updated_balance = Escrow.price_point_value - deduct;
            UserQuery.findMerchantandUpdate({ mid, updated_balance, wallet_type });
            // 2. update revenue wallet:
            wallet_type = 'REVENUE'
            updated_balance = Revenue.price_point_value + deduct;
            UserQuery.findMerchantandUpdate({ mid, updated_balance, wallet_type })
            // 3. update wallet history table

            return Escrow;
        }
        else
            throw ({ code: 404, message: 'Insufficient balance', status: 'Fail' });
    }
    else
        throw ({ code: 404, message: 'User not found', status: 'Fail' });
}


const settleRevenue = async({ query, mid}) => {
    const Escrow = await UserQuery.findOneSpecialMerchant(mid, 'ESCROW');
    const Revenue = await UserQuery.findOneSpecialMerchant(mid, 'REVENUE');
    const order = await UserQuery.findOneOrder(query.order_id);
    const deduct = query.points;

    if (order) {
        throw ({ code: 404, message: 'Order Id already exists', status: 'Fail' });
    }

    if (Escrow && Revenue && !order) {
        // Transfer amount from REVENUE to ESCROW
        if (deduct <= Revenue.price_point_value) {
            var wallet_type = 'REVENUE';
            // 1. update revenue wallet:
            var updated_balance = Revenue.price_point_value - deduct;
            UserQuery.findMerchantandUpdate({ mid, updated_balance, wallet_type });
            // 2. update revenue wallet:
            wallet_type = 'ESCROW'
            updated_balance = Escrow.price_point_value + deduct;
            UserQuery.findMerchantandUpdate({ mid, updated_balance, wallet_type })
            // 3. update wallet history table

            return Revenue;
        }
        else
            throw ({ code: 404, message: 'Insufficient balance', status: 'Fail' });
    }
    else
        throw ({ code: 404, message: 'User not found', status: 'Fail' });
}


module.exports = { settleEscrow , settleRevenue};