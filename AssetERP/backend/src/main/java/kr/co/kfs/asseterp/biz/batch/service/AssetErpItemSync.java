package kr.co.kfs.asseterp.biz.batch.service;

import kr.co.kfs.asseterp.biz.batch.dto.BatchAstClassTree;
import kr.co.kfs.asseterp.biz.batch.mapper.BatchAssetMapper;
import kr.co.kfs.asseterp.biz.batch.mapper.BatchFundMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

/**
 * AS-IS BatchMain.assetErpItemInsert (L2423) + createAstManager (L2539) — ICAM 종목을 Asset-ERP 자산분류(ast01)에 넣는다.
 * icamItem(SB18)과 이후 종목을 만드는 분기가 함께 쓴다. 트랜잭션은 부르는 쪽이 건다.
 * 분류 'IC'(대·중분류 폴더)와 'IT'(종목). 코드·순번은 DB 함수/최대값으로 채번한다.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class AssetErpItemSync {

    public static final String TYPE_CLASS = "IC";
    public static final String TYPE_ITEM = "IT";

    private final BatchAssetMapper assetMapper;
    private final BatchFundMapper fundMapper;

    /** 분류(IC) 폴더를 만든다. 새 ID를 돌려준다 */
    public Long createClass(Long companyId, Long parentId, String name) {
        return insert(companyId, parentId, name, TYPE_CLASS, null, null, null, false, null);
    }

    /** 종목(IT)을 만든다. icamLCode는 ICAM 계정 대분류(1채권·2유동성·3주식·F부동산·6집합투자), icamSCode는 부동산 세부 */
    public Long createItem(Long companyId, Long parentId, String name, String isin, String icamLCode, String icamSCode,
                           boolean managerAuto, LocalDate stdDate) {
        return insert(companyId, parentId, name, TYPE_ITEM, isin, icamLCode, icamSCode, managerAuto, stdDate);
    }

    private Long insert(Long companyId, Long parentId, String name, String typeCode, String isin, String lCode, String sCode,
                        boolean managerAuto, LocalDate stdDate) {
        Long id = fundMapper.selectSeq();
        String code = assetMapper.createCode(parentId, typeCode, companyId);
        long seq = parentId == 0L ? Long.parseLong(code) : assetMapper.createSeq(companyId, parentId);

        String l = null;
        String m = null;
        String s = null;
        if (TYPE_ITEM.equals(typeCode)) {
            if ("1".equals(lCode)) {                       // 1.채권
                l = "20"; m = "2040";
            } else if ("2".equals(lCode)) {                // 2.유동성자산
                l = "10"; m = "1010";
                if ("10101".equals(isin)) {                // 10101:예금
                    s = "101003";                          // 101003:보통예금
                }
            } else if ("3".equals(lCode)) {                // 3.주식
                l = "20"; m = "2010"; s = "201099";
            } else if ("F".equals(lCode)) {                // F.부동산
                l = "50";
                m = switch (sCode == null ? "" : sCode) {
                    case "1", "H" -> "5020";               // 건물
                    case "2", "I" -> "5010";               // 토지
                    case "4", "K" -> "5060";               // 건설중인자산
                    case "5", "L" -> "5030";               // 구축물
                    case "7", "N" -> "5040";               // 차량운반구
                    case "8", "O" -> "5050";               // 비품
                    default -> "5090";                     // 기타
                };
                s = m + "99";
            } else if ("6".equals(lCode)) {                // 6.집합투자
                l = "20"; m = "2050";
            }
            // 담당자&담당부서 지정
            if (managerAuto) {
                createAstManager(id, companyId, stdDate);
            }
        }

        assetMapper.insertClassTree(new BatchAstClassTree(id, companyId, code, name, parentId, seq, typeCode, "true",
                TYPE_ITEM.equals(typeCode) ? isin : null, l, m, s, "2", "true"));
        return id;
    }

    /** 기준일에 유효한 모든 부서를 이 자산의 담당부서로 지정 */
    private void createAstManager(Long astId, Long companyId, LocalDate stdDate) {
        for (Long orgId : assetMapper.selectOrgIds(companyId, stdDate)) {
            assetMapper.insertDeptManager(fundMapper.selectSeq(), astId, orgId, companyId);
        }
    }
}
