package kr.co.kfs.asseterp.biz.tdm.mapper;

import kr.co.kfs.asseterp.biz.tdm.dto.ChckEvidExtrReq;
import kr.co.kfs.asseterp.biz.tdm.dto.ChckEvidExtrRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/tdm/mapper/tdm64_chck_evid_extr.xml (EE49) */
@Mapper
public interface TdmChckEvidExtrMapper {
    /** 대상(이행점검 tdm52 또는 미흡 조치기록 tdm63)이 내 회사 것이면 1 — tdm64에는 회사 열이 없다 */
    int countTarget(@Param("companyId") Long companyId, @Param("targetId") Long targetId);

    /** AS-IS selectByTargetId */
    List<ChckEvidExtrRes> selectByTargetId(@Param("targetId") Long targetId);

    /** 지금 targetId에 달려 있는 행 ID (바꾸거나 지울 수 있는 행인지 확인) */
    List<Long> selectIdsByTargetId(@Param("targetId") Long targetId);

    Long selectNextId();

    /** AS-IS UpdateDataModel INSERT */
    int insertEvid(@Param("id") Long id, @Param("targetId") Long targetId, @Param("row") ChckEvidExtrReq row, @Param("updName") String updName);

    /** AS-IS UpdateDataModel UPDATE — 화면에서 고치는 열(문서번호·문서명·작성일·시스템명·비고) */
    int updateEvid(@Param("targetId") Long targetId, @Param("row") ChckEvidExtrReq row, @Param("updName") String updName);

    /** AS-IS UpdateDataModel DELETE */
    int deleteEvids(@Param("targetId") Long targetId, @Param("ids") List<Long> ids);
}
