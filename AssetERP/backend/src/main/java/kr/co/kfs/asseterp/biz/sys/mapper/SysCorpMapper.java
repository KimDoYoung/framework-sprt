package kr.co.kfs.asseterp.biz.sys.mapper;

import kr.co.kfs.asseterp.biz.sys.dto.CorpRes;
import kr.co.kfs.asseterp.biz.sys.dto.CorpSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/sys/mapper/sys15_corp.xml + UpdateDataModel(sys15_corp) */
@Mapper
public interface SysCorpMapper {
    /** AS-IS selectByCompanyId (corpType·searchText는 LIKE 패턴, useYn은 "true"면 사용 거래처만) */
    List<CorpRes> selectByCompanyId(@Param("companyId") Long companyId, @Param("corpType") String corpType,
                                    @Param("searchText") String searchText, @Param("useYn") boolean useYn);

    /** AS-IS sys15_corp.selectByUseYn (empYn=false 가지: 사용 중인 거래처만) */
    List<CorpRes> selectLookup(@Param("companyId") Long companyId, @Param("corpType") String corpType, @Param("searchText") String searchText);

    CorpRes selectById(@Param("corpId") Long corpId);

    Long selectNextId();

    /** AS-IS selectCorpCodeCheck: 같은 회사의 사용 중인 같은 코드 건수(자기 자신 제외) */
    long selectCorpCodeCheck(@Param("companyId") Long companyId, @Param("corpCode") String corpCode, @Param("corpId") Long corpId);

    /** AS-IS selectNewCorpCodeByBizNo: 사업자번호 10자리 + 2자리 일련번호 */
    String selectNewCorpCodeByBizNo(@Param("companyId") Long companyId, @Param("bizNo") String bizNo);

    /** AS-IS checkUseCorpId: f_check_use_corp_id — 다른 테이블이 쓰고 있으면 1 */
    int checkUseCorpId(@Param("corpId") Long corpId);

    int insertCorp(@Param("companyId") Long companyId, @Param("req") CorpSaveReq req);

    int updateCorp(@Param("companyId") Long companyId, @Param("req") CorpSaveReq req);

    int deleteCorps(@Param("companyId") Long companyId, @Param("corpIds") List<Long> corpIds);

    /** AS-IS insertInitData: 관리자(회사 0)의 거래처를 고른 회사로 복사 */
    int insertInitData(@Param("companyId") Long companyId);
}
