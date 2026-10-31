package kr.co.kfs.asseterp.biz.apr.mapper;

import kr.co.kfs.asseterp.biz.apr.dto.AprDocFormRow;
import kr.co.kfs.asseterp.biz.apr.dto.AprEditFileRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprFileDelRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprLoadDoc2Cond;
import kr.co.kfs.asseterp.biz.apr.dto.AprLoadDoc2Row;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/sys/mapper/sys10_file.xml · sys61_file_del.xml · dcr/mapper/dcr00_doc_list.xml selectByText · dcr05_doc_type.xml (V05 첨부 옵션·불러오기·양식) */
@Mapper
public interface AprAttachMapper {
    /** AS-IS dbConfig.getSeq */
    long selectNextId();

    /** AS-IS sys10_file.selectByParentId */
    List<AprEditFileRes> selectEditFiles(@Param("parentId") Long parentId);

    /** AS-IS sys10_file.updateOthers */
    int updateFileOthers(@Param("fileId") Long fileId, @Param("parentId") Long parentId, @Param("printYn") String printYn, @Param("extYn") String extYn, @Param("seq") String seq);

    /** AS-IS sys61_file_del.selectByParentId */
    List<AprFileDelRes> selectFileDels(@Param("parentId") Long parentId);

    /** 삭제할 파일이 이 문서의 것인가 (AS-IS는 화면이 고른 행을 믿었다) */
    int countFilesIn(@Param("parentId") Long parentId, @Param("ids") List<Long> ids);

    /** AS-IS sys61_file_del.insert */
    int insertFileDel(@Param("fileDelId") Long fileDelId, @Param("fileId") Long fileId, @Param("parentId") Long parentId, @Param("reason") String reason, @Param("personId") Long personId);

    /** AS-IS sys10_file.updateParentId (note가 있는 가지) — 파일의 부모를 삭제 내역 ID로 옮긴다 */
    int moveFileParent(@Param("fileId") Long fileId, @Param("parentId") Long parentId, @Param("note") String note);

    /** AS-IS dcr00_doc_list.selectByText (admin == 'false', statusCheckYn == 'false', keyTable 없음) */
    List<AprLoadDoc2Row> selectLoadDocs(@Param("c") AprLoadDoc2Cond cond);

    /** AS-IS dcr05_doc_type.selectByClassTreeId */
    List<AprDocFormRow> selectDocFormsByClassTree(@Param("companyId") Long companyId, @Param("classTreeId") Long classTreeId, @Param("titleName") String titleName, @Param("formClassCode") String formClassCode);

    /** AS-IS dcr05_doc_type.selectByName */
    List<AprDocFormRow> selectDocFormsByName(@Param("companyId") Long companyId, @Param("titleName") String titleName, @Param("formClassCode") String formClassCode);
}
