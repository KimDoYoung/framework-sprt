package kr.co.kfs.asseterp.biz.scm.mapper;

import kr.co.kfs.asseterp.biz.scm.dto.SrDevMngSaveReq;
import kr.co.kfs.asseterp.biz.scm.dto.SrRes;
import kr.co.kfs.asseterp.biz.scm.dto.SrSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface ScmSrMapper {

    /** AS-IS scm01_sr.selectByText (gubun = 'sr' 고정). searchText는 '%…%' 또는 null, systemCode·srStatus는 '%'면 전체 */
    List<SrRes> selectByText(@Param("startDate") LocalDate startDate, @Param("closeDate") LocalDate closeDate,
                             @Param("searchText") String searchText, @Param("systemCode") String systemCode,
                             @Param("srStatus") String srStatus, @Param("checkBox01") boolean checkBox01,
                             @Param("checkBox02") boolean checkBox02, @Param("checkBoxMyReg") boolean checkBoxMyReg,
                             @Param("personId") Long personId);

    /** AS-IS scm01_sr.selectById */
    SrRes selectById(@Param("srId") Long srId);

    /** AS-IS scm01_sr.createSrNo — 그날 의뢰번호의 다음 번호(그날 첫 건이면 null) */
    String createSrNo(@Param("srDate") LocalDate srDate);

    /** AS-IS dbConfig.getSeq */
    long selectNextId();

    /** 저장(UpdateDataModel 동적 INSERT) — 등록자는 로그인 사원 */
    int insertSr(@Param("personId") Long personId, @Param("srNo") String srNo, @Param("req") SrSaveReq req);

    /** 저장(UpdateDataModel 동적 UPDATE) — 폼이 바꾸는 열만 */
    int updateSr(@Param("srNo") String srNo, @Param("req") SrSaveReq req);

    /** AS-IS scm01_sr.updateContent */
    int updateContent(@Param("srId") Long srId, @Param("srContent") String srContent);

    /** 마지막 결재자의 승인·반려로 의뢰의 승인상태를 바꾼다(AS-IS: Scm01_Sr.update 로 모델째 저장) */
    int updateApprStatus(@Param("srId") Long srId, @Param("apprStatusCd") String apprStatusCd);

    /** AS-IS Scm01_Sr.delete (UpdateDataModel.deleteModel) */
    int deleteSrs(@Param("srIds") List<Long> srIds);

    /** AS-IS scm01_sr.selectByDevMng (EE16) — 승인 완료 의뢰, checkBox01 = 미완료건만 */
    List<SrRes> selectByDevMng(@Param("startDate") LocalDate startDate, @Param("closeDate") LocalDate closeDate,
                               @Param("searchText") String searchText, @Param("systemCode") String systemCode,
                               @Param("srStatus") String srStatus, @Param("checkBox01") boolean checkBox01);

    /** 개발관리 폼 저장 (EE16) */
    int updateDevMng(@Param("srId") Long srId, @Param("req") SrDevMngSaveReq req);

    /** AS-IS scm01_sr.updateResultContent (EE16) */
    int updateResultContent(@Param("srId") Long srId, @Param("resultContent") String resultContent);
}
