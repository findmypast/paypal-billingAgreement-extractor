
WITH
    summary
    AS
    (
        SELECT
            fp.future_pay_id, fp.member_key, fp.date_added,
            ROW_NUMBER() OVER(PARTITION BY fp.member_key ORDER BY fp.date_added DESC) AS rank
        FROM
            [FH1-MSSQL02].[fmp_future_pay].[dbo].[future_pay] fp
        WHERE
	fp.member_key IN (
	SELECT
                member_key
            FROM
                FMP.dbo.member_trans mt
            WHERE
		mt.currency_key IN (1, 6)
            GROUP BY
		mt.member_key  
)
            AND fp.future_pay_system = 'PP'
            AND fp.future_pay_id IS NOT NULL
            And fp.future_pay_id not Like 'B-%'
    )
-- ORDER BY
-- 	fp.date_added DESC)

SELECT *
FROM summary
WHERE rank = 1